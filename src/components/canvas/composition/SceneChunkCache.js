/**
 * SceneChunkCache.js
 * High-performance OffscreenCanvas chunk caching system for static scene layers.
 * Pre-renders static scenery once to ensure zero CPU/GPU waste during scroll.
 */

export class SceneChunkCache {
  constructor() {
    this.chunks = new Map(); // Key: `${sceneId}_${layerId}` -> HTMLCanvasElement | OffscreenCanvas
    this.buildCounts = new Map();
  }

  getChunkKey(sceneId, layerId) {
    return `${sceneId}_${layerId}`;
  }

  /**
   * Builds or returns an existing cached chunk for a scene layer
   */
  getOrCreate(sceneId, layerId, width, height, builderFn) {
    const key = this.getChunkKey(sceneId, layerId);
    if (this.chunks.has(key)) {
      return this.chunks.get(key);
    }

    // Create new buffer
    let canvas;
    if (typeof OffscreenCanvas !== 'undefined') {
      canvas = new OffscreenCanvas(width, height);
    } else {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Execute builder function onto chunk buffer
    builderFn(ctx, width, height);

    this.chunks.set(key, canvas);
    this.buildCounts.set(key, (this.buildCounts.get(key) || 0) + 1);

    return canvas;
  }

  get(sceneId, layerId) {
    return this.chunks.get(this.getChunkKey(sceneId, layerId)) || null;
  }

  invalidate(sceneId) {
    const prefix = `${sceneId}_`;
    for (const key of this.chunks.keys()) {
      if (key.startsWith(prefix)) {
        this.chunks.delete(key);
      }
    }
  }

  clear() {
    this.chunks.clear();
  }

  getStats() {
    return {
      cachedChunkCount: this.chunks.size,
      buildCounts: Object.fromEntries(this.buildCounts),
    };
  }
}

export const sceneChunkCache = new SceneChunkCache();
