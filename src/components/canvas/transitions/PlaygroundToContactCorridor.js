import { spriteCache } from '../core/SpriteCache';

/**
 * PlaygroundToContactCorridor.js
 * Transition corridor connecting Playground (Chòi Câu Cá Chạng Vạng) to Contact (Bếp Củi Sông Đêm).
 * Progress range: 0.78 -> 0.88, World Y: 1020 -> 1180.
 */

export const PLAYGROUND_CONTACT_CORRIDOR_RANGE = { start: 0.78, end: 0.88 };

export const PLAYGROUND_CONTACT_SHARED_OBJECTS = [
  { id: 'p-c-coconut-1', spriteKey: 'water_coconut_grove', x: 740, y: 1180, width: 96, height: 80, anchorX: 48, anchorY: 76, layer: 'layer_far_landscape' },
  { id: 'p-c-lantern-1', spriteKey: 'kerosene_lantern', x: 680, y: 1220, width: 24, height: 32, anchorX: 12, anchorY: 28, layer: 'layer_mid_ground' },
  { id: 'p-c-hyacinth-1', spriteKey: 'lotus_hyacinth_cluster', x: 580, y: 1260, width: 32, height: 24, anchorX: 16, anchorY: 20, layer: 'layer_foreground' },
];

export class PlaygroundToContactCorridor {
  static getSharedObjects(scrollProgress) {
    if (scrollProgress >= PLAYGROUND_CONTACT_CORRIDOR_RANGE.start && scrollProgress <= PLAYGROUND_CONTACT_CORRIDOR_RANGE.end) {
      return PLAYGROUND_CONTACT_SHARED_OBJECTS;
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
