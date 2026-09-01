import { spriteCache } from '../core/SpriteCache';

/**
 * AboutToProjectsCorridor.js
 * Transition corridor connecting About (Cầu Khỉ) to Projects (Bến Xuồng Ba Lá Hoàng Hôn).
 * Progress range: 0.40 -> 0.52, World X: 1400 -> 1720.
 */

export const ABOUT_PROJECTS_CORRIDOR_RANGE = { start: 0.40, end: 0.52 };

export const ABOUT_PROJECTS_SHARED_OBJECTS = [
  { id: 'a-p-coconut-1', spriteKey: 'water_coconut_grove', x: 1460, y: 780, width: 96, height: 80, anchorX: 48, anchorY: 76, layer: 'layer_far_landscape' },
  { id: 'a-p-banana-1', spriteKey: 'banana_tree', x: 1520, y: 840, width: 64, height: 96, anchorX: 32, anchorY: 92, layer: 'layer_mid_ground' },
  { id: 'a-p-mooring-1', spriteKey: 'mooring_post', x: 1600, y: 865, width: 16, height: 32, anchorX: 8, anchorY: 28, layer: 'layer_mid_ground' },
  { id: 'a-p-hyacinth-1', spriteKey: 'lotus_hyacinth_cluster', x: 1540, y: 920, width: 32, height: 24, anchorX: 16, anchorY: 20, layer: 'layer_foreground' },
];

export class AboutToProjectsCorridor {
  static getSharedObjects(scrollProgress) {
    if (scrollProgress >= ABOUT_PROJECTS_CORRIDOR_RANGE.start && scrollProgress <= ABOUT_PROJECTS_CORRIDOR_RANGE.end) {
      return ABOUT_PROJECTS_SHARED_OBJECTS;
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
