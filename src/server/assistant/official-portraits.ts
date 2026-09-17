import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PRINCIPAL } from "@/lib/principal-data";

type OfficialPortrait = {
  mimeType: "image/jpeg";
  dataBase64: string;
  label: string;
};

let cachedPrincipal: OfficialPortrait | null | undefined;

/**
 * Loads the official Principal portrait for vision comparison.
 * Cached in memory; returns null if the asset is unavailable.
 */
export async function loadOfficialPrincipalPortrait(): Promise<OfficialPortrait | null> {
  if (cachedPrincipal !== undefined) return cachedPrincipal;

  const candidates = [
    join(process.cwd(), "src", "assets", "principal-imtiyaz-shaw.jpg"),
    join(process.cwd(), "dist", "client", "assets", "principal-imtiyaz-shaw.jpg"),
  ];

  for (const path of candidates) {
    try {
      const buf = await readFile(path);
      if (buf.byteLength < 1_000 || buf.byteLength > 900_000) continue;
      cachedPrincipal = {
        mimeType: "image/jpeg",
        dataBase64: buf.toString("base64"),
        label: `${PRINCIPAL.name}, ${PRINCIPAL.role} — official institute portrait`,
      };
      return cachedPrincipal;
    } catch {
      /* try next path */
    }
  }

  cachedPrincipal = null;
  return null;
}
