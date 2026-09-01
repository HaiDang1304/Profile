/**
 * SpriteFactory: Pixel-level rasterization utilities.
 * Every coordinate operates on strict 1:1 logical pixels (integer coordinates only).
 */

export function setPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

export function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function drawShadedBox(ctx, x, y, w, h, { outline, base, light, dark }) {
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rw = Math.round(w);
  const rh = Math.round(h);

  // 1. 1px Outline
  if (outline) {
    ctx.fillStyle = outline;
    ctx.fillRect(rx - 1, ry - 1, rw + 2, rh + 2);
  }

  // 2. Base Fill
  ctx.fillStyle = base;
  ctx.fillRect(rx, ry, rw, rh);

  // 3. Highlight (Top and Left edges - Top-Left Light Source)
  if (light) {
    ctx.fillStyle = light;
    ctx.fillRect(rx, ry, rw, 1);
    ctx.fillRect(rx, ry, 1, rh);
  }

  // 4. Shadow (Bottom and Right edges)
  if (dark) {
    ctx.fillStyle = dark;
    ctx.fillRect(rx, ry + rh - 1, rw, 1);
    ctx.fillRect(rx + rw - 1, ry, 1, rh);
  }
}

export function drawPixelMatrix(ctx, startX, startY, matrix, colorMap) {
  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r];
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      if (char !== ' ' && char !== '.' && colorMap[char]) {
        ctx.fillStyle = colorMap[char];
        ctx.fillRect(startX + c, startY + r, 1, 1);
      }
    }
  }
}

export function drawPixelLine(ctx, x0, y0, x1, y1, color) {
  ctx.fillStyle = color;
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let cx = x0;
  let cy = y0;

  while (true) {
    ctx.fillRect(cx, cy, 1, 1);
    if (cx === x1 && cy === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      cx += sx;
    }
    if (e2 < dx) {
      err += dx;
      cy += sy;
    }
  }
}
