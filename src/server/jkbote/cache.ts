import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { JkboteCachePayload, LiveNotice } from "@/lib/jkbote-live";

const CACHE_DIR = join(process.cwd(), ".cache");
const CACHE_FILE = join(CACHE_DIR, "jkbote-notices.json");

let memoryCache: JkboteCachePayload | null = null;

export function readJkboteCache(): JkboteCachePayload | null {
  if (memoryCache) return memoryCache;
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const raw = readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as JkboteCachePayload;
    if (!parsed || !Array.isArray(parsed.notices)) return null;
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function writeJkboteCache(payload: JkboteCachePayload): void {
  memoryCache = payload;
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.warn("[jkbote] Unable to persist notice cache:", error);
  }
}

export function previousNoticeMap(cache: JkboteCachePayload | null): Map<string, LiveNotice> {
  const map = new Map<string, LiveNotice>();
  for (const notice of cache?.notices ?? []) {
    map.set(notice.id, notice);
    map.set(notice.url, notice);
  }
  return map;
}
