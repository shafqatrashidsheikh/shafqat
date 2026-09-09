import { getLatestNews } from "@/lib/updates-data";
import { previousNoticeMap, readJkboteCache, writeJkboteCache } from "@/server/jkbote/cache";
import {
  dedupeNotices,
  isRelevantToGpw,
  parseJkboteNoticeHtml,
  toLiveNotice,
} from "@/server/jkbote/parse";
import {
  JKBOTE_FETCH_TTL_MS,
  JKBOTE_SOURCE_PAGES,
  type JkboteCachePayload,
  type LiveNotice,
} from "@/lib/jkbote-live";

async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GPW-Srinagar-Website/1.0 (+https://localhost; official notice sync)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function fallbackFromStatic(previous: Map<string, LiveNotice>, nowIso: string): LiveNotice[] {
  return getLatestNews(12).map((item) => {
    const prev = previous.get(item.fileUrl);
    return {
      id: item.id,
      title: item.title,
      date: item.date,
      publishedAt: item.publishedAt,
      category:
        item.category === "Examination"
          ? /result/i.test(item.title)
            ? "Results"
            : "Examination"
          : item.category,
      url: item.fileUrl,
      source: "JKBOTE" as const,
      sourcePage: "https://jkbote.ac.in/notice.php",
      isNew: item.priority === "New",
      firstSeenAt: prev?.firstSeenAt ?? nowIso,
      lastSeenAt: nowIso,
    };
  });
}

export async function syncJkboteNotices(options?: {
  force?: boolean;
}): Promise<JkboteCachePayload> {
  const existing = readJkboteCache();
  const now = Date.now();
  const fetchedAtMs = existing?.fetchedAt ? Date.parse(existing.fetchedAt) : 0;

  if (
    !options?.force &&
    existing?.ok &&
    existing.notices.length > 0 &&
    Number.isFinite(fetchedAtMs) &&
    now - fetchedAtMs < JKBOTE_FETCH_TTL_MS
  ) {
    return existing;
  }

  const nowIso = new Date().toISOString();
  const previous = previousNoticeMap(existing);
  const collected: LiveNotice[] = [];
  const errors: string[] = [];

  for (const page of JKBOTE_SOURCE_PAGES) {
    try {
      const html = await fetchPage(page);
      const parsed = parseJkboteNoticeHtml(html, page);
      for (const raw of parsed) {
        if (!isRelevantToGpw(raw.title, raw.url)) continue;
        collected.push(toLiveNotice(raw, previous, nowIso));
      }
    } catch (error) {
      errors.push(`${page}: ${error instanceof Error ? error.message : "fetch failed"}`);
    }
  }

  let notices = dedupeNotices(collected);

  if (notices.length === 0) {
    notices = fallbackFromStatic(previous, nowIso);
    const payload: JkboteCachePayload = {
      fetchedAt: existing?.fetchedAt ?? nowIso,
      notices,
      sourcePages: [...JKBOTE_SOURCE_PAGES],
      ok: false,
      error: errors.join("; ") || "No relevant JKBOTE notices parsed; showing verified fallback.",
    };
    if (existing?.notices?.length) {
      // Prefer last good official cache over static fallback when available
      return {
        ...existing,
        ok: false,
        error: payload.error,
      };
    }
    writeJkboteCache(payload);
    return payload;
  }

  const payload: JkboteCachePayload = {
    fetchedAt: nowIso,
    notices,
    sourcePages: [...JKBOTE_SOURCE_PAGES],
    ok: true,
    ...(errors.length ? { error: `Partial sync: ${errors.join("; ")}` } : {}),
  };
  writeJkboteCache(payload);
  return payload;
}

export async function getLiveJkboteNotices(options?: {
  force?: boolean;
  limit?: number;
}): Promise<JkboteCachePayload> {
  const payload = await syncJkboteNotices(options);
  const limit = options?.limit ?? 24;
  return {
    ...payload,
    notices: payload.notices.slice(0, limit),
  };
}
