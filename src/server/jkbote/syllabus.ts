import { join } from "node:path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  detectSemesterFromUrl,
  emptyJkboteSyllabusPayload,
  JKBOTE_HOME_URL,
  JKBOTE_SEMESTER_CURRICULUM_FALLBACK,
  JKBOTE_SYLLABUS_TTL_MS,
  type JkboteSemesterLink,
  type JkboteSyllabusPayload,
} from "@/lib/jkbote-syllabus";

const CACHE_DIR = join(process.cwd(), ".cache");
const CACHE_FILE = join(CACHE_DIR, "jkbote-syllabus.json");

function readCache(): JkboteSyllabusPayload | null {
  try {
    if (!existsSync(CACHE_FILE)) return null;
    return JSON.parse(readFileSync(CACHE_FILE, "utf8")) as JkboteSyllabusPayload;
  } catch {
    return null;
  }
}

function writeCache(payload: JkboteSyllabusPayload): void {
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.warn("[jkbote-syllabus] Unable to persist cache:", error);
  }
}

async function fetchHomepageHtml(): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(JKBOTE_HOME_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GPW-Srinagar-Website/1.0 (+official JKBOTE syllabus sync)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`JKBOTE homepage HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractPdfHrefs(html: string): string[] {
  const hrefs = new Set<string>();
  const re = /href=["']([^"']+\.pdf)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    try {
      hrefs.add(new URL(match[1], JKBOTE_HOME_URL).toString());
    } catch {
      /* skip bad href */
    }
  }
  return [...hrefs];
}

function mergeSemesterLinks(liveUrls: string[]): JkboteSemesterLink[] {
  const bySem = new Map<number, JkboteSemesterLink>();

  for (const row of JKBOTE_SEMESTER_CURRICULUM_FALLBACK) {
    bySem.set(row.semester, { ...row, live: false });
  }

  for (const href of liveUrls) {
    const semester = detectSemesterFromUrl(href);
    if (!semester) continue;
    const label = `Semester ${semester}`;
    // Prefer curriculum / NEP / semester-named board PDFs over unrelated PDFs
    if (!/semester|curriculum|nep|sem/i.test(href) && bySem.has(semester)) continue;
    bySem.set(semester, { semester, label, href, live: true });
  }

  return [1, 2, 3, 4, 5, 6].map((n) => bySem.get(n)!);
}

export async function getJkboteSyllabusLinks(options?: {
  force?: boolean;
}): Promise<JkboteSyllabusPayload> {
  const existing = readCache();
  const now = Date.now();
  const fetchedAtMs = existing?.fetchedAt ? Date.parse(existing.fetchedAt) : 0;

  if (
    !options?.force &&
    existing?.ok &&
    existing.semesters.length > 0 &&
    Number.isFinite(fetchedAtMs) &&
    now - fetchedAtMs < JKBOTE_SYLLABUS_TTL_MS
  ) {
    return existing;
  }

  try {
    const html = await fetchHomepageHtml();
    const pdfs = extractPdfHrefs(html);
    const semesters = mergeSemesterLinks(pdfs);
    const liveCount = semesters.filter((s) => s.live).length;
    const payload: JkboteSyllabusPayload = {
      fetchedAt: new Date().toISOString(),
      ok: true,
      sourcePage: JKBOTE_HOME_URL,
      semesters,
      ...(liveCount < 3
        ? {
            error:
              "Some semester PDFs were not listed on the JKBOTE homepage; verified board fallbacks are used for missing semesters.",
          }
        : {}),
    };
    writeCache(payload);
    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "JKBOTE syllabus sync failed";
    if (existing?.semesters?.length) {
      return { ...existing, ok: false, error: message };
    }
    const fallback = emptyJkboteSyllabusPayload(message);
    writeCache(fallback);
    return fallback;
  }
}
