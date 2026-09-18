/**
 * Cut solid studio plates from VO officer portraits + unify outfit navy.
 * Auto-samples corner plate color (not assuming #D9E2F5).
 *
 * Usage: node scripts/process-vo-officers.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dir = path.join(root, "public", "virtual-office");
const assets = path.join(
  process.env.USERPROFILE || "",
  ".cursor",
  "projects",
  "c-Users-Dell-Desktop-kashmir-tech-gateway-main",
  "assets",
);

const SOURCES = [
  { src: path.join(assets, "vo-blend-approval.png"), out: "cut-student-approval.png" },
  { src: path.join(assets, "vo-blend-academic.png"), out: "cut-academic-data.png" },
  { src: path.join(assets, "vo-blend-website.png"), out: "cut-website-management.png" },
  { src: path.join(assets, "vo-blend-notify.png"), out: "cut-student-notification.png" },
];

const NAVY = { r: 30, g: 58, b: 95 };

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function dist3(r, g, b, pr, pg, pb) {
  const dr = r - pr;
  const dg = g - pg;
  const db = b - pb;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function samplePlate(data, width, height) {
  // Average several corner patches
  const pts = [
    [4, 4],
    [width - 5, 4],
    [4, height - 5],
    [width - 5, height - 5],
    [20, 20],
    [width - 21, 20],
    [Math.floor(width / 2), 8],
  ];
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let n = 0;
  for (const [x, y] of pts) {
    const i = (y * width + x) * 4;
    sr += data[i];
    sg += data[i + 1];
    sb += data[i + 2];
    n += 1;
  }
  return { r: Math.round(sr / n), g: Math.round(sg / n), b: Math.round(sb / n) };
}

function isOutfitBlue(r, g, b) {
  const L = luminance(r, g, b);
  if (L < 0.12 || L > 0.58) return false;
  if (b <= r + 15) return false;
  if (b <= g + 4) return false;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  if (chroma < 30) return false;
  if (r > g + 18 && r > b - 8) return false; // skin
  return true;
}

function unifyNavy(r, g, b) {
  const L = luminance(r, g, b);
  const scale = Math.max(0.55, Math.min(1.6, L / 0.22));
  return {
    r: Math.round(Math.min(255, NAVY.r * scale + (L > 0.32 ? 14 : 0))),
    g: Math.round(Math.min(255, NAVY.g * scale + (L > 0.32 ? 18 : 0))),
    b: Math.round(Math.min(255, NAVY.b * scale + (L > 0.32 ? 24 : 0))),
  };
}

async function processOne(src, outName) {
  if (!fs.existsSync(src)) {
    console.warn("missing source", src);
    return;
  }
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const plate = samplePlate(data, width, height);
  console.log(outName, "plate≈", plate);

  const out = Buffer.from(data);
  let cleared = 0;
  for (let i = 0; i < out.length; i += 4) {
    let r = out[i];
    let g = out[i + 1];
    let b = out[i + 2];

    const d = dist3(r, g, b, plate.r, plate.g, plate.b);
    // Aggressive plate removal — solid studio fill
    if (d < 48) {
      out[i + 3] = 0;
      cleared += 1;
      continue;
    }
    if (d < 78) {
      const t = (d - 48) / 30;
      out[i + 3] = Math.round(t * 255);
      if (out[i + 3] < 40) cleared += 1;
    }

    // Also catch light blue plates even if slightly off sample
    const L = luminance(r, g, b);
    if (L > 0.55 && b > g && b > r && b - r > 20 && d < 95) {
      const soften = Math.max(0, 1 - (d - 48) / 50);
      out[i + 3] = Math.min(out[i + 3], Math.round((1 - soften * 0.85) * 255));
    }

    r = out[i];
    g = out[i + 1];
    b = out[i + 2];
    if (out[i + 3] > 40 && isOutfitBlue(r, g, b)) {
      const n = unifyNavy(r, g, b);
      out[i] = n.r;
      out[i + 1] = n.g;
      out[i + 2] = n.b;
    }
  }

  const dest = path.join(dir, outName);
  await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(dest);
  const pct = ((100 * cleared) / (width * height)).toFixed(1);
  console.log("wrote", outName, `cleared~${pct}%`);
}

for (const item of SOURCES) {
  await processOne(item.src, item.out);
}
console.log("done");
