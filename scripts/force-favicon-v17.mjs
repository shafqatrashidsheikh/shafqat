/**
 * Force a cache-busting GPW favicon set from the uploaded source image.
 * Writes both classic names and unique gpw-v17-* filenames.
 */
import { copyFile, writeFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const STAMP = "gpw-v17";

async function resolveSource() {
  const local = path.join(publicDir, "_favicon-source.jpg");
  const assetsDir = path.join(
    process.env.USERPROFILE || "",
    ".cursor",
    "projects",
    "c-Users-Dell-Desktop-kashmir-tech-gateway-main",
    "assets",
  );
  try {
    const names = fs.readdirSync(assetsDir).filter((n) => n.includes("62b61c82"));
    if (names[0]) {
      const src = path.join(assetsDir, names[0]);
      await copyFile(src, local);
      console.log("Copied uploaded logo → public/_favicon-source.jpg");
    }
  } catch {
    /* keep existing local source */
  }
  if (!fs.existsSync(local)) {
    throw new Error("Missing public/_favicon-source.jpg");
  }
  const buf = fs.readFileSync(local);
  console.log(
    "source",
    buf.length,
    crypto.createHash("sha256").update(buf).digest("hex").slice(0, 12),
  );
  return buf;
}

async function makePng(source, size) {
  return sharp(source)
    .rotate()
    .toColorspace("srgb")
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: "lanczos3",
    })
    .png({ compressionLevel: 9, force: true })
    .toBuffer();
}

async function main() {
  const source = await resolveSource();
  const p16 = await makePng(source, 16);
  const p32 = await makePng(source, 32);
  const p48 = await makePng(source, 48);
  const p180 = await makePng(source, 180);
  const p192 = await makePng(source, 192);
  const p512 = await makePng(source, 512);
  const ico = await toIco([p16, p32, p48]);

  const writes = [
    ["favicon-16x16.png", p16],
    ["favicon-32x32.png", p32],
    ["favicon-48x48.png", p48],
    ["apple-touch-icon.png", p180],
    ["android-chrome-192x192.png", p192],
    ["android-chrome-512x512.png", p512],
    ["favicon.ico", ico],
    [`${STAMP}-16.png`, p16],
    [`${STAMP}-32.png`, p32],
    [`${STAMP}-48.png`, p48],
    [`${STAMP}.ico`, ico],
  ];

  for (const [file, buf] of writes) {
    await writeFile(path.join(publicDir, file), buf);
    console.log("wrote", file, buf.length);
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="GPW Srinagar">
  <image width="32" height="32" href="/${STAMP}-32.png"/>
</svg>
`;
  await writeFile(path.join(publicDir, "favicon.svg"), svg);
  await writeFile(path.join(publicDir, `${STAMP}.svg`), svg);
  console.log("done", STAMP);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
