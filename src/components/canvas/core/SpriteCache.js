/**
 * SpriteCache: Single-instance raster cache for pixel art sprites.
 * Pre-renders sprites onto OffscreenCanvas to guarantee single-pass rendering.
 */

export const spriteCreationCounts = new Map();

class SpriteCacheManager {
  constructor() {
    this.cache = new Map();
    this.factories = new Map();
  }

  register(key, factory) {
    this.factories.set(key, factory);
  }

  createSpriteCanvas(width, height) {
    if (typeof OffscreenCanvas !== 'undefined') {
      const offscreen = new OffscreenCanvas(width, height);
      const ctx = offscreen.getContext('2d', { alpha: true });
      if (ctx) ctx.imageSmoothingEnabled = false;
      return offscreen;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (ctx) ctx.imageSmoothingEnabled = false;
    return canvas;
  }

  get(key, frame = 0) {
    const cacheKey = `${key}_f${frame}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const factory = this.factories.get(key);
    if (!factory) {
      console.warn(`[SpriteCache] No factory registered for key: ${key}`);
      return null;
    }

    // Increment creation count to prove single-execution guarantee
    const currentCount = (spriteCreationCounts.get(key) || 0) + 1;
    spriteCreationCounts.set(key, currentCount);

    const canvas = factory(this.createSpriteCanvas.bind(this), frame);
    this.cache.set(cacheKey, canvas);
    return canvas;
  }

  has(key, frame = 0) {
    return this.cache.has(`${key}_f${frame}`);
  }

  clear() {
    this.cache.clear();
    spriteCreationCounts.clear();
  }
}

export const spriteCache = new SpriteCacheManager();
