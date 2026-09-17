import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { JkboteAdmissionStatusPayload } from "@/lib/jkbote-admission-status";

const CACHE_DIR = join(process.cwd(), ".cache");
const CACHE_FILE = join(CACHE_DIR, "jkbote-admission-status.json");

let memoryCache: JkboteAdmissionStatusPayload | null = null;

export function readPortalStatusCache(): JkboteAdmissionStatusPayload | null {
  if (memoryCache) return memoryCache;
  try {
    if (!existsSync(CACHE_FILE)) return null;
    const raw = readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as JkboteAdmissionStatusPayload;
    if (!parsed?.status || !parsed.portalUrl) return null;
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function writePortalStatusCache(payload: JkboteAdmissionStatusPayload): void {
  memoryCache = payload;
  try {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.warn("[jkbote-admission-status] Unable to persist cache:", error);
  }
}
