import { sceneChunkCache } from './SceneChunkCache';
import { spriteCache } from '../core/SpriteCache';

/**
 * SceneCompositionRenderer.js
 * Combines pre-rendered static layer chunks with animated dynamic objects.
 */

export class SceneCompositionRenderer {
  constructor(sceneId, composition) {
    this.sceneId = sceneId;
    this.composition = composition;
  }

  /**
   * Builds and caches the static chunk canvases for each layer
   */
  buildStaticChunks(width, height) {
    const { sceneId, clusters, worldBounds } = this.composition;
    
    // Safely default world bounds to 0 if not defined
    const originX = worldBounds?.x || 0;
    const originY = worldBounds?.y || 0;

    // 1. Far Landscape Static Chunk
    sceneChunkCache.getOrCreate(sceneId, 'far_landscape', width, height, (ctx) => {
      const farObjs = clusters.background?.objects?.filter((o) => o.isStatic) ||
                      clusters.villageBackground?.objects?.filter((o) => o.isStatic) ||
                      clusters.riversideVillage?.objects?.filter((o) => o.isStatic) ||
                      clusters.nightVillage?.objects?.filter((o) => o.isStatic) || [];
      farObjs.forEach((obj) => {
        const sprite = spriteCache.get(obj.spriteKey, 0);
        if (sprite) {
          const w = obj.width * (obj.scale || 1);
          const h = obj.height * (obj.scale || 1);
          const ax = (obj.anchorX || w / 2) * (obj.scale || 1);
          const ay = (obj.anchorY || h / 2) * (obj.scale || 1);
          
          // [SỬA LỖI] Trừ đi origin của worldBounds để đồng bộ hệ tọa độ chunk nội bộ
          const drawX = obj.x - ax - originX;
          const drawY = obj.y - ay - originY;
          
          ctx.drawImage(sprite, Math.round(drawX), Math.round(drawY), Math.round(w), Math.round(h));
        }
      });
    });

    // 2. Mid Ground Static Chunk (Render midground static objects)
    sceneChunkCache.getOrCreate(sceneId, 'mid_ground', width, height, (ctx) => {
      const allClusterKeys = Object.keys(clusters);
      const midObjs = [];

      allClusterKeys.forEach((key) => {
        const objs = clusters[key]?.objects?.filter((o) => o.isStatic && o.id !== 'bg-sun') || [];
        midObjs.push(...objs);
      });

      // Sort by y-coordinate for correct painter's depth
      midObjs.sort((a, b) => a.y - b.y);

      midObjs.forEach((obj) => {
        const sprite = spriteCache.get(obj.spriteKey, 0);
        if (sprite) {
          const w = obj.width * (obj.scale || 1);
          const h = obj.height * (obj.scale || 1);
          const ax = (obj.anchorX || w / 2) * (obj.scale || 1);
          const ay = (obj.anchorY || h / 2) * (obj.scale || 1);
          
          // [SỬA LỖI] Trừ đi origin của worldBounds
          const drawX = obj.x - ax - originX;
          const drawY = obj.y - ay - originY;
          
          ctx.drawImage(sprite, Math.round(drawX), Math.round(drawY), Math.round(w), Math.round(h));
        }
      });
    });

    // 3. Foreground Static Chunk
    sceneChunkCache.getOrCreate(sceneId, 'foreground', width, height, (ctx) => {
      const fgObjs = clusters.foreground?.objects?.filter((o) => o.isStatic) ||
                     clusters.water?.objects?.filter((o) => o.isStatic) || [];
      fgObjs.forEach((obj) => {
        const sprite = spriteCache.get(obj.spriteKey, 0);
        if (sprite) {
          const w = obj.width * (obj.scale || 1);
          const h = obj.height * (obj.scale || 1);
          const ax = (obj.anchorX || w / 2) * (obj.scale || 1);
          const ay = (obj.anchorY || h / 2) * (obj.scale || 1);
          
          // [SỬA LỖI] Trừ đi origin của worldBounds
          const drawX = obj.x - ax - originX;
          const drawY = obj.y - ay - originY;
          
          ctx.drawImage(sprite, Math.round(drawX), Math.round(drawY), Math.round(w), Math.round(h));
        }
      });
    });
  }

  getStaticChunk(layerId) {
    return sceneChunkCache.get(this.sceneId, layerId);
  }
}
