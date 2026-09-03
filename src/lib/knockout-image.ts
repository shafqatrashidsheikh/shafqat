/**
 * Remove the pale rectangular backdrop from a loader PNG by flooding
 * from the image edges. Interior whites (book pages, diploma paper)
 * stay because they are not connected to the border.
 */
function isPaleBackdrop(r: number, g: number, b: number, a: number, lumaMin: number): boolean {
  if (a < 12) return true;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  const neutral = Math.abs(r - g) < 10 && Math.abs(g - b) < 12 && Math.abs(r - b) < 14;
  return neutral && chroma < 16 && luma > lumaMin;
}

export function knockoutPaleBackground(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);
  const px = imageData.data;
  const seen = new Uint8Array(width * height);
  const stack: number[] = [];

  const consider = (x: number, y: number, lumaMin: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (seen[i] === 1) return;
    const o = i * 4;
    const r = px[o] ?? 0;
    const g = px[o + 1] ?? 0;
    const b = px[o + 2] ?? 0;
    const a = px[o + 3] ?? 0;
    if (!isPaleBackdrop(r, g, b, a, lumaMin)) return;
    seen[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < width; x += 1) {
    consider(x, 0, 198);
    consider(x, height - 1, 198);
  }
  for (let y = 0; y < height; y += 1) {
    consider(0, y, 198);
    consider(width - 1, y, 198);
  }

  while (stack.length > 0) {
    const i = stack.pop();
    if (i === undefined) break;
    const x = i % width;
    const y = (i - x) / width;
    const o = i * 4;
    px[o + 3] = 0;
    consider(x + 1, y, 198);
    consider(x - 1, y, 198);
    consider(x, y + 1, 198);
    consider(x, y - 1, 198);
  }

  const neighborTransparent = (x: number, y: number) => {
    const checks = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    return checks.some(([nx, ny]) => {
      if (nx === undefined || ny === undefined || nx < 0 || ny < 0 || nx >= width || ny >= height) {
        return false;
      }
      const alpha = px[(ny * width + nx) * 4 + 3] ?? 0;
      return alpha < 12;
    });
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      const o = i * 4;
      const alpha = px[o + 3] ?? 0;
      if (alpha < 12) continue;
      const r = px[o] ?? 0;
      const g = px[o + 1] ?? 0;
      const b = px[o + 2] ?? 0;
      if (isPaleBackdrop(r, g, b, alpha, 188) && neighborTransparent(x, y)) {
        px[o + 3] = 0;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function knockoutPaleBackgroundToUrl(image: HTMLImageElement): Promise<string> {
  const canvas = knockoutPaleBackground(image);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not process loader artwork"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}
