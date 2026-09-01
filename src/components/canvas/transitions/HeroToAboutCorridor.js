import { spriteCache } from '../core/SpriteCache';

/**
 * HeroToAboutCorridor.js
 * Transition corridor connecting Hero (Hiên Nhà) to About (Cầu Khỉ & Mương Dừa).
 * Progress range: 0.16 -> 0.28, World X: 880 -> 1200.
 */

export const HERO_ABOUT_CORRIDOR_RANGE = { start: 0.16, end: 0.28 };

export const HERO_ABOUT_SHARED_OBJECTS = [
  { id: 'h-a-path-1', spriteKey: 'brick_path', x: 880, y: 280, width: 48, height: 16, anchorX: 24, anchorY: 8, layer: 'layer_mid_ground' },
  { id: 'h-a-path-2', spriteKey: 'brick_path', x: 940, y: 310, width: 48, height: 16, anchorX: 24, anchorY: 8, layer: 'layer_mid_ground' },
  { id: 'h-a-fence-1', spriteKey: 'bamboo_fence', x: 920, y: 270, width: 48, height: 24, anchorX: 24, anchorY: 22, layer: 'layer_mid_ground' },
  { id: 'h-a-banana-1', spriteKey: 'banana_tree', x: 980, y: 260, width: 64, height: 96, anchorX: 32, anchorY: 92, layer: 'layer_mid_ground' },
  { id: 'h-a-coconut-1', spriteKey: 'nipa_palm_cluster', x: 1060, y: 250, width: 120, height: 110, anchorX: 60, anchorY: 105, layer: 'layer_mid_ground' },
  { id: 'h-a-hyacinth-1', spriteKey: 'lotus_hyacinth_cluster', x: 1020, y: 330, width: 32, height: 24, anchorX: 16, anchorY: 20, layer: 'layer_foreground' },
];

export class HeroToAboutCorridor {
  static getSharedObjects(scrollProgress) {
    if (scrollProgress >= HERO_ABOUT_CORRIDOR_RANGE.start && scrollProgress <= HERO_ABOUT_CORRIDOR_RANGE.end) {
      return HERO_ABOUT_SHARED_OBJECTS;
    }
    return [];
  }

  static renderLayerObjects(ctx, layerId, objects) {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (obj.layer !== layerId) continue;

      const sprite = spriteCache.get(obj.spriteKey, 0);
      if (sprite) {
        const w = obj.width;
        const h = obj.height;
        const ax = obj.anchorX || w / 2;
        const ay = obj.anchorY || h / 2;
        ctx.drawImage(sprite, Math.round(obj.x - ax), Math.round(obj.y - ay), Math.round(w), Math.round(h));
      }
    }
  }
}
