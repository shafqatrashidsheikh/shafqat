/**
 * Generate favicons from the official crest.
 * Downscales only (lanczos) — no upscale, sharpen, blur, or recolor.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

async function loadSource() {
  try {
    return await sharp(path.join(publicDir, "gpw-srinagar-logo.png")).toBuffer();
  } catch {
    return await sharp(path.join(publicDir, "gpw-srinagar-logo.jpg")).toBuffer();
  }
}

function circleMask(size) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
    </svg>`,
  );
}

/** Exact crest pixels, downscaled only for the tab icon size. */
async function crestPng(source, size) {
  return sharp(source)
    .resize(size, size, { fit: "contain", background: "#ffffff", kernel: "lanczos3" })
    .composite([{ input: circleMask(size), blend: "dest-in" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function main() {
  const source = await loadSource();
  const meta = await sharp(source).metadata();
  console.log(`Favicon source: ${meta.width}x${meta.height}`);

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
    const buffer = await crestPng(source, size);
    await writeFile(path.join(publicDir, file), buffer);
    console.log(`Wrote ${file} (${size}x${size}, ${Math.round(buffer.byteLength / 1024)}KB)`);
    if (size <= 48) icoSizes.push(buffer);
  }

  const ico = await toIco(icoSizes);
  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  console.log("Wrote favicon.ico (16, 32, 48)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
