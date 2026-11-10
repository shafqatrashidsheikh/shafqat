import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const CACHE_DIR = join(process.cwd(), ".cache");
const CACHE_FILE = join(CACHE_DIR, "admission-setting.json");

let memoryAdmissionEnabled: boolean | null = null;

export function readAdmissionSettingCache(): boolean {
  if (memoryAdmissionEnabled !== null) {
    return memoryAdmissionEnabled;
  }
  try {
    if (!existsSync(CACHE_FILE)) {
      memoryAdmissionEnabled = true;
      return true;
    }
    const raw = readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed?.enabled === "boolean") {
      memoryAdmissionEnabled = parsed.enabled;
      return parsed.enabled;
    }
    memoryAdmissionEnabled = true;
    return true;
  } catch {
    memoryAdmissionEnabled = true;
    return true;
  }
}

export function writeAdmissionSettingCache(enabled: boolean): void {
  memoryAdmissionEnabled = enabled;
  try {
    if (!existsSync(CACHE_DIR)) {
      mkdirSync(CACHE_DIR, { recursive: true });
    }
    writeFileSync(
      CACHE_FILE,
      JSON.stringify({ enabled, updatedAt: new Date().toISOString() }, null, 2),
      "utf8",
    );
  } catch (error) {
    console.warn("[admission-setting] Unable to persist cache:", error);
  }
}

