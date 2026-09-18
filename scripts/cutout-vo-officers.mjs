/**
 * Flood-fill remove studio plates + unify outfit navy.
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
  ["seat-approval.png", "cut-student-approval.png"],
  ["seat-academic.png", "cut-academic-data.png"],
  ["seat-website.png", "cut-website-management.png"],
  ["seat-notify.png", "cut-student-notification.png"],
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
    [Math.floor(width / 4), 4],
    [Math.floor((3 * width) / 4), 4],
  ];
  const seedColors = seeds.map(([x, y]) => {
    const i = (y * width + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  });

  const matchesPlate = (r, g, b) => {
    for (const p of seedColors) {
      if (dist(r, g, b, p) < 42) return true;
    }
    const L = lum(r, g, b);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    // white / near-white studio
    if (L > 0.9 && chroma < 28) return true;
    // light gray floor wash sometimes generated
    if (L > 0.82 && chroma < 18) return true;
    // mid/light blue studio fill
    if (b > r + 12 && b >= g - 2 && L > 0.42 && L < 0.95 && chroma > 18 && chroma < 110) {
      for (const p of seedColors) {
        if (dist(r, g, b, p) < 78) return true;
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

  // Soft fringe on near-plate edge pixels
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    let minD = Infinity;
    for (const p of seedColors) minD = Math.min(minD, dist(r, g, b, p));
    const L = lum(r, g, b);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if ((minD < 55 && matchesPlate(r, g, b)) || (L > 0.88 && chroma < 22)) {
      out[i + 3] = Math.max(0, Math.round(((minD - 18) / 40) * 255));
    }
  }

  // Unify outfit navy (hijab / blazer / chair mesh blues)
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] < 50) continue;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const L = lum(r, g, b);
    if (L > 0.1 && L < 0.62 && b > r + 12 && b > g + 2) {
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (chroma > 24 && !(r > g + 18 && r > b - 8)) {
        const scale = Math.max(0.55, Math.min(1.65, L / 0.22));
        out[i] = Math.min(255, Math.round(NAVY.r * scale + (L > 0.32 ? 12 : 0)));
        out[i + 1] = Math.min(255, Math.round(NAVY.g * scale + (L > 0.32 ? 16 : 0)));
        out[i + 2] = Math.min(255, Math.round(NAVY.b * scale + (L > 0.32 ? 22 : 0)));
      }
    }
  }

  // Trim transparent margins so character sits bottom-heavy in frame
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[(y * width + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  // Square canvas, content bottom-aligned so feet/chair sit on floor
  const side = Math.max(cw, ch);
  const canvas = Buffer.alloc(side * side * 4, 0);
  const ox = Math.floor((side - cw) / 2);
  const oy = side - ch;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const si = ((minY + y) * width + (minX + x)) * 4;
      const di = ((oy + y) * side + (ox + x)) * 4;
      canvas[di] = out[si];
      canvas[di + 1] = out[si + 1];
      canvas[di + 2] = out[si + 2];
      canvas[di + 3] = out[si + 3];
    }
  }

  const dest = path.join(dir, outName);
  await sharp(canvas, { raw: { width: side, height: side, channels: 4 } })
    .resize(900, 900, { fit: "inside" })
    .png()
    .toFile(dest);
  console.log(outName, `cleared ${((100 * cleared) / (width * height)).toFixed(1)}%`);
}

for (const [s, o] of JOBS) await run(s, o);
console.log("done");
