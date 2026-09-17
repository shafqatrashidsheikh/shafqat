/**
 * Sync the official crest into public/ without degrading quality.
 *
 * - Prefers public/_crest-source-upload.jpg (exact upload bytes)
 * - Writes a lossless PNG of the decoded pixels (no resize / sharpen / recolor)
 * - Keeps the original JPEG bytes alongside for scripts that still expect .jpg
 *
 * Usage: node scripts/generate-logo-assets.mjs
 */
import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const upload = path.join(publicDir, "_crest-source-upload.jpg");
const masterJpg = path.join(publicDir, "gpw-srinagar-logo.jpg");
const masterPng = path.join(publicDir, "gpw-srinagar-logo.png");

async function loadExactSource() {
  try {
    return await readFile(upload);
  } catch {
    return await readFile(masterJpg);
  }
}

async function main() {
  const raw = await loadExactSource();
  const meta = await sharp(raw).metadata();
  console.log(`Source crest (exact): ${meta.width}x${meta.height} ${meta.format}`);

  // Preserve original JPEG bytes as the jpg master (no re-encode).
  await writeFile(masterJpg, raw);
  await writeFile(upload, raw);

  // Lossless PNG of decoded pixels — no resize, sharpen, blur, or recolor.
  const png = await sharp(raw)
    .rotate()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  await writeFile(masterPng, png);
  console.log(
    `Wrote gpw-srinagar-logo.png (${meta.width}x${meta.height}, ${Math.round(png.byteLength / 1024)}KB lossless)`,
  );

  // Loader + legacy paths use the same full-resolution crest.
  await copyFile(masterPng, path.join(publicDir, "loader-gpw-crest.png"));
  await copyFile(masterJpg, path.join(publicDir, "loader-gpw-crest.jpg"));
  await copyFile(masterJpg, path.join(publicDir, "loader-gpw-srinagar-logo.jpg"));
  await copyFile(masterJpg, path.join(root, "src", "assets", "loader", "gpw-srinagar-logo.jpg"));

  console.log("Synced loader crest copies (full resolution, unmodified pixels)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
