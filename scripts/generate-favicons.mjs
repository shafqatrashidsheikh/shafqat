/**
 * Browser-tab favicons ONLY — from public/_favicon-source.* (uploaded crest).
 * Downscale with lanczos3; no crop, stretch, blur, sharpen, or recolor.
 * Does not touch the site header logo assets.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

async function loadFaviconSource() {
  const candidates = ["_favicon-source.png", "_favicon-source.jpg", "_favicon-source.jpeg", "_favicon-source.webp"];
  for (const file of candidates) {
    try {
      const input = sharp(path.join(publicDir, file), { failOn: "none" });
      const meta = await input.metadata();
      const buffer = await input.rotate().toBuffer();
      console.log(`Favicon source: ${file} (${meta.width}x${meta.height}, ${meta.format}, alpha=${Boolean(meta.hasAlpha)})`);
      return { buffer, hasAlpha: Boolean(meta.hasAlpha) };
    } catch {
      /* try next */
    }
  }
  throw new Error("Missing public/_favicon-source.(png|jpg|jpeg|webp) — place the uploaded logo there first.");
}

/**
 * Exact proportions: contain inside a square. Transparent canvas when source has alpha;
 * otherwise opaque white (JPEG crest on white).
 */
async function faviconPng(source, size, hasAlpha) {
  const background = hasAlpha
    ? { r: 0, g: 0, b: 0, alpha: 0 }
    : { r: 255, g: 255, b: 255, alpha: 1 };

  return sharp(source)
    .resize(size, size, {
      fit: "contain",
      background,
      kernel: "lanczos3",
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
}

async function writeSvgFavicon(png64) {
  const b64 = png64.toString("base64");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Government Polytechnic for Women, Srinagar">
  <image href="data:image/png;base64,${b64}" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
  await writeFile(path.join(publicDir, "favicon.svg"), svg);
  console.log("Wrote favicon.svg");
}

async function main() {
  const { buffer: source, hasAlpha } = await loadFaviconSource();

  const outputs = [
    { size: 16, file: "favicon-16x16.png" },
    { size: 32, file: "favicon-32x32.png" },
    { size: 48, file: "favicon-48x48.png" },
    { size: 180, file: "apple-touch-icon.png" },
    { size: 192, file: "android-chrome-192x192.png" },
    { size: 512, file: "android-chrome-512x512.png" },
  ];

  const icoSizes = [];

  for (const { size, file } of outputs) {
    const png = await faviconPng(source, size, hasAlpha);
    await writeFile(path.join(publicDir, file), png);
    console.log(`Wrote ${file} (${size}x${size}, ${Math.round(png.byteLength / 1024)}KB)`);
    if (size <= 48) icoSizes.push(png);
  }

  await writeSvgFavicon(await faviconPng(source, 64, hasAlpha));

  const ico = await toIco(icoSizes);
  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  console.log("Wrote favicon.ico (16, 32, 48)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
