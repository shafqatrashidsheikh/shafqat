import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "public", "gpw-srinagar-logo.jpg");
const publicDir = path.join(root, "public");

async function circularPng(input, size) {
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`,
  );

  return sharp(input)
    .trim({ threshold: 12 })
    .resize(size, size, { fit: "cover", position: "center" })
    .composite([{ input: circle, blend: "dest-in" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

async function main() {
  const trimmed = await sharp(source).trim({ threshold: 12 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  console.log(`Trimmed logo: ${meta.width}x${meta.height}`);

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
    const buffer = await circularPng(trimmed, size);
    await writeFile(path.join(publicDir, file), buffer);
    console.log(`Wrote ${file} (${size}x${size})`);
    if (size <= 48) icoSizes.push(buffer);
  }

  const ico = await toIco(icoSizes);
  await writeFile(path.join(publicDir, "favicon.ico"), ico);
  console.log("Wrote favicon.ico");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
