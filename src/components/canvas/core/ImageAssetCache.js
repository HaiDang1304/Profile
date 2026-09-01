const imageAssets = new Map();

function isBackdropPixel(data, index) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  return r >= 228 && g >= 228 && b >= 228 && Math.max(r, g, b) - Math.min(r, g, b) <= 10;
}

function removeConnectedLightBackdrop(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const pixelCount = width * height;
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;
  const enqueue = (pixel) => {
    if (visited[pixel] || !isBackdropPixel(data, pixel * 4)) return;
    visited[pixel] = 1;
    queue[tail] = pixel;
    tail += 1;
  };
  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }
  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    data[pixel * 4 + 3] = 0;
    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y < height - 1) enqueue(pixel + width);
  }
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    if (isBackdropPixel(data, pixel * 4)) data[pixel * 4 + 3] = 0;
  }
  ctx.putImageData(imageData, 0, 0);
}

function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function loadPixelAsset(key, url, options = {}) {
  if (imageAssets.has(key)) return imageAssets.get(key);
  const asset = { canvas: null, loaded: false, error: null };
  imageAssets.set(key, asset);
  const image = new Image();
  image.decoding = 'async';
  image.addEventListener('load', () => {
    const source = createCanvas(image.naturalWidth, image.naturalHeight);
    const sourceCtx = source.getContext('2d', { willReadFrequently: Boolean(options.removeLightBackdrop) });
    sourceCtx.imageSmoothingEnabled = false;
    sourceCtx.drawImage(image, 0, 0);
    if (options.removeLightBackdrop) removeConnectedLightBackdrop(sourceCtx, source.width, source.height);
    const targetWidth = options.width || source.width;
    const targetHeight = options.height || Math.round((source.height / source.width) * targetWidth);
    const target = createCanvas(targetWidth, targetHeight);
    const targetCtx = target.getContext('2d');
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.drawImage(source, 0, 0, targetWidth, targetHeight);
    asset.canvas = target;
    asset.loaded = true;
  }, { once: true });
  image.addEventListener('error', () => {
    asset.error = new Error(`Unable to load pixel asset: ${key}`);
  }, { once: true });
  image.src = url;
  return asset;
}

export function clearImageAssetCache() {
  imageAssets.clear();
}
