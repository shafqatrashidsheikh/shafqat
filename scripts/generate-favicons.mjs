/**
 * Production browser favicons from the uploaded GPW crest only.
 * - Trim empty/near-white margins (not the logo itself)
 * - Contain + lanczos3 (no stretch)
 * - Circular alpha removes square corner plate only (seal stays intact)
 * - Does not touch header logo or any page UI
 */
import { copyFile, unlink, writeFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

/** Cache-bust stamp — change when replacing the crest. */
export const FAVICON_STAMP = "gpw-icon-v20";
const MASTER = 1024;
const SOURCE_OUT = path.join(publicDir, "favicon-source-gpw.jpg");

async function resolveUploadedSource() {
  const assetsDir = path.join(
    process.env.USERPROFILE || "",
    ".cursor",
    "projects",
    "c-Users-Dell-Desktop-kashmir-tech-gateway-main",
    "assets",
  );

  const preferred = [
    "62b61c82-2ec9-4369-b3f5-7959d74b8950",
    "cc052dac-8577-470e-be44-df17490bed88",
  ];

  let chosen = null;
  try {
    const names = fs.readdirSync(assetsDir);
    for (const id of preferred) {
      const hit = names.find((n) => n.includes(id));
      if (hit) {
        chosen = path.join(assetsDir, hit);
        break;
      }
    }
    if (!chosen) {
      const gpw = names
        .filter((n) => /WhatsApp_Image_2026-08-25_at_11\.05\.02_AM/i.test(n))
        .map((n) => {
          const p = path.join(assetsDir, n);
          return { p, mtime: fs.statSync(p).mtimeMs, size: fs.statSync(p).size };
        })
        .filter((r) => r.size > 100_000)
        .sort((a, b) => b.mtime - a.mtime);
      if (gpw[0]) chosen = gpw[0].p;
    }
  } catch {
    /* fall through */
  }

  if (chosen) {
    await copyFile(chosen, SOURCE_OUT);
    console.log("Source copied from upload → favicon-source-gpw.jpg");
  } else if (!fs.existsSync(SOURCE_OUT)) {
    const legacy = path.join(publicDir, "_favicon-source.jpg");
    if (fs.existsSync(legacy)) {
      await copyFile(legacy, SOURCE_OUT);
      console.log("Source from legacy _favicon-source.jpg");
    } else {
      throw new Error("No uploaded GPW logo found for favicon source.");
    }
  }

  const buf = fs.readFileSync(SOURCE_OUT);
  console.log(
    "favicon source",
    buf.length,
    crypto.createHash("sha256").update(buf).digest("hex").slice(0, 12),
  );
  return buf;
}

/**
 * Full seal, margins trimmed, square corners transparent (logo circle intact).
 */
async function buildMaster(source) {
  const trimmed = await sharp(source)
    .rotate()
    .trim({ threshold: 12 })
    .toColorspace("srgb")
    .ensureAlpha()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  const w = meta.width ?? 1;
  const h = meta.height ?? 1;
  const side = Math.max(w, h);

  /* Contain into square — no stretch; keep full logo. */
  const squared = await sharp(trimmed)
    .resize(side, side, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: "lanczos3",
    })
    .resize(MASTER, MASTER, {
      fit: "fill",
      kernel: "lanczos3",
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  /* Transparent outside the circular seal — removes white corner plate only. */
  const r = MASTER / 2 - 1;
  const maskSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MASTER}" height="${MASTER}">
  <circle cx="${MASTER / 2}" cy="${MASTER / 2}" r="${r}" fill="#fff"/>
</svg>`,
  );
  const mask = await sharp(maskSvg).png().toBuffer();

  return sharp(squared)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function sizePng(master, size) {
  return sharp(master)
    .resize(size, size, {
      fit: "fill",
      kernel: "lanczos3",
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
}

async function removeObsolete() {
  const obsolete = [
    "favicon-blank-v18.ico",
    "gpw-v17-16.png",
    "gpw-v17-32.png",
    "gpw-v17-48.png",
    "gpw-v17-180.png",
    "gpw-v17-192.png",
    "gpw-v17-512.png",
    "gpw-v17.ico",
    "gpw-v17.svg",
  ];
  for (const name of obsolete) {
    try {
      await unlink(path.join(publicDir, name));
      console.log("removed", name);
    } catch {
      /* ignore */
    }
  }
}

async function main() {
  const source = await resolveUploadedSource();
  const master = await buildMaster(source);

  const p16 = await sizePng(master, 16);
  const p32 = await sizePng(master, 32);
  const p48 = await sizePng(master, 48);
  const p180 = await sizePng(master, 180);
  const p192 = await sizePng(master, 192);
  const p512 = await sizePng(master, 512);
  const ico = await toIco([p16, p32, p48]);

  const writes = [
    ["favicon-16x16.png", p16],
    ["favicon-32x32.png", p32],
    ["favicon-48x48.png", p48],
    ["apple-touch-icon.png", p180],
    ["android-chrome-192x192.png", p192],
    ["android-chrome-512x512.png", p512],
    ["favicon.ico", ico],
    [`${FAVICON_STAMP}-16.png`, p16],
    [`${FAVICON_STAMP}-32.png`, p32],
    [`${FAVICON_STAMP}-48.png`, p48],
    [`${FAVICON_STAMP}-180.png`, p180],
    [`${FAVICON_STAMP}-192.png`, p192],
    [`${FAVICON_STAMP}-512.png`, p512],
    [`${FAVICON_STAMP}.ico`, ico],
  ];

  for (const [file, buf] of writes) {
    await writeFile(path.join(publicDir, file), buf);
    console.log(`wrote ${file} (${buf.byteLength} bytes)`);
  }

  /* PNG-backed SVG for browsers that prefer SVG type — no embedded junk base64. */
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Government Polytechnic for Women, Srinagar">
  <image width="32" height="32" href="/${FAVICON_STAMP}-32.png" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
  await writeFile(path.join(publicDir, "favicon.svg"), svg);
  await writeFile(path.join(publicDir, `${FAVICON_STAMP}.svg`), svg);

  await removeObsolete();
  console.log("done", FAVICON_STAMP);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
