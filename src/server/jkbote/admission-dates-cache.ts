import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { JkboteAdmissionDatesPayload } from "@/lib/jkbote-admission-dates";

const CACHE_DIR = join(process.cwd(), ".cache");
const CACHE_FILE = join(CACHE_DIR, "jkbote-admission-dates.json");

let memoryCache: JkboteAdmissionDatesPayload | null = null;

export function readAdmissionDatesCache(): JkboteAdmissionDatesPayload | null {
  if (memoryCache) return memoryCache;
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const raw = readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as JkboteAdmissionDatesPayload;
    if (!parsed || !Array.isArray(parsed.rows) || parsed.rows.length !== 4) return null;
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function writeAdmissionDatesCache(payload: JkboteAdmissionDatesPayload): void {
  memoryCache = payload;
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.warn("[jkbote-admission-dates] Unable to persist cache:", error);
  }
}
