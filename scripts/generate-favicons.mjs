/**
 * Browser-tab favicons ONLY — from public/_favicon-source.* (uploaded GPW logo).
 * Exact source: resize only (contain + lanczos3). No crop, trim, mask, recolor, or redraw.
 * Writes classic names + unique gpw-v17-* names used by __root.tsx.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const STAMP = "gpw-v17";

async function loadFaviconSource() {
  const candidates = [
    "_favicon-source.png",
    "_favicon-source.jpg",
    "_favicon-source.jpeg",
    "_favicon-source.webp",
  ];
  for (const file of candidates) {
    try {
      const inputPath = path.join(publicDir, file);
      const input = sharp(inputPath, { failOn: "none" });
      const meta = await input.metadata();
      const buffer = await input.rotate().toColorspace("srgb").toBuffer();
      console.log(`Favicon source: ${file} (${meta.width}x${meta.height}, ${meta.format})`);
      return buffer;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "Missing public/_favicon-source.(png|jpg|jpeg|webp) — place the uploaded logo there first.",
  );
}

async function faviconPng(source, size) {
  return sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: "lanczos3",
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
}

async function main() {
  const source = await loadFaviconSource();

  const sizes = {
    16: await faviconPng(source, 16),
    32: await faviconPng(source, 32),
    48: await faviconPng(source, 48),
    180: await faviconPng(source, 180),
    192: await faviconPng(source, 192),
    512: await faviconPng(source, 512),
  };

  const ico = await toIco([sizes[16], sizes[32], sizes[48]]);

  const writes = [
    ["favicon-16x16.png", sizes[16]],
    ["favicon-32x32.png", sizes[32]],
    ["favicon-48x48.png", sizes[48]],
    ["apple-touch-icon.png", sizes[180]],
    ["android-chrome-192x192.png", sizes[192]],
    ["android-chrome-512x512.png", sizes[512]],
    ["favicon.ico", ico],
    [`${STAMP}-16.png`, sizes[16]],
    [`${STAMP}-32.png`, sizes[32]],
    [`${STAMP}-48.png`, sizes[48]],
    [`${STAMP}-180.png`, sizes[180]],
    [`${STAMP}-192.png`, sizes[192]],
    [`${STAMP}-512.png`, sizes[512]],
    [`${STAMP}.ico`, ico],
  ];

  for (const [file, buf] of writes) {
    await writeFile(path.join(publicDir, file), buf);
    console.log(`Wrote ${file} (${Math.round(buf.byteLength / 1024)}KB)`);
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="GPW Srinagar">
  <image width="32" height="32" href="/${STAMP}-32.png"/>
</svg>
`;
  await writeFile(path.join(publicDir, "favicon.svg"), svg);
  await writeFile(path.join(publicDir, `${STAMP}.svg`), svg);
  console.log("Wrote favicon.svg + stamped icons");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
