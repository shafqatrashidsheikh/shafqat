/**
 * Flood-fill cut solid studio plates + unify outfit navy.
 * node scripts/cutout-vo-officers.mjs
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

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

const NAVY = { r: 30, g: 58, b: 95 };
const JOBS = [
  ["vo-blend-approval.png", "cut-student-approval.png"],
  ["vo-blend-academic.png", "cut-academic-data.png"],
  ["vo-blend-website.png", "cut-website-management.png"],
  ["vo-blend-notify.png", "cut-student-notification.png"],
];

function lum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
function dist(r, g, b, p) {
  return Math.hypot(r - p.r, g - p.g, b - p.b);
}

async function run(srcName, outName) {
  const src = path.join(assets, srcName);
  if (!fs.existsSync(src)) throw new Error(`missing ${src}`);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.from(data);
  const visited = new Uint8Array(width * height);

  const seeds = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 3],
    [3, Math.floor(height / 2)],
    [width - 4, Math.floor(height / 2)],
  ];
  const seedColors = seeds.map(([x, y]) => {
    const i = (y * width + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  });

  const matchesPlate = (r, g, b) => {
    for (const p of seedColors) {
      if (dist(r, g, b, p) < 38) return true;
    }
    const L = lum(r, g, b);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    // mid/light blue studio fill (not white shirt which has very low chroma + high L with r≈g≈b)
    if (b > r + 12 && b >= g - 2 && L > 0.42 && L < 0.95 && chroma > 18 && chroma < 110) {
      for (const p of seedColors) {
        if (dist(r, g, b, p) < 72) return true;
      }
    }
    return false;
  };

  const q = [];
  for (const [sx, sy] of seeds) {
    q.push(sx, sy);
    visited[sy * width + sx] = 1;
  }

  let cleared = 0;
  let qi = 0;
  while (qi < q.length) {
    const x = q[qi++];
    const y = q[qi++];
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (!matchesPlate(r, g, b)) continue;
    out[idx + 3] = 0;
    cleared += 1;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const vi = ny * width + nx;
      if (visited[vi]) continue;
      visited[vi] = 1;
      const j = vi * 4;
      if (matchesPlate(data[j], data[j + 1], data[j + 2])) {
        q.push(nx, ny);
      }
    }
  }

  // Soft fringe: any remaining near-plate pixels
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    let minD = Infinity;
    for (const p of seedColors) minD = Math.min(minD, dist(r, g, b, p));
    if (minD < 55 && matchesPlate(r, g, b)) {
      out[i + 3] = Math.round(((minD - 20) / 35) * 255);
      if (out[i + 3] < 0) out[i + 3] = 0;
    }
  }

  // Unify outfit navy
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] < 50) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const L = lum(r, g, b);
    if (L > 0.12 && L < 0.58 && b > r + 15 && b > g + 4) {
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (chroma > 28 && !(r > g + 18 && r > b - 8)) {
        const scale = Math.max(0.55, Math.min(1.6, L / 0.22));
        out[i] = Math.min(255, Math.round(NAVY.r * scale + (L > 0.32 ? 14 : 0)));
        out[i + 1] = Math.min(255, Math.round(NAVY.g * scale + (L > 0.32 ? 18 : 0)));
        out[i + 2] = Math.min(255, Math.round(NAVY.b * scale + (L > 0.32 ? 24 : 0)));
      }
    }
  }

  const dest = path.join(dir, outName);
  await sharp(out, { raw: { width, height, channels: 4 } }).png().toFile(dest);
  console.log(outName, `cleared ${(100 * cleared) / (width * height)}%`.slice(0, 22));
}

for (const [s, o] of JOBS) await run(s, o);
console.log("done");
