import { spriteCache } from '../core/SpriteCache';
import { HERO_ABOUT_SHARED_OBJECTS } from '../transitions/HeroToAboutCorridor';
import { ABOUT_PROJECTS_SHARED_OBJECTS } from '../transitions/AboutToProjectsCorridor';
import { PLAYGROUND_CONTACT_SHARED_OBJECTS } from '../transitions/PlaygroundToContactCorridor';

export const TRANSITION_WORLD_LENGTH = 320;

export class TransitionCorridor {
  static getSharedObjects(scrollProgress) {
    const objects = [];

    // Corridor 1: Hero -> About (progress 0.16 -> 0.28, world X: 880..1200)
    if (scrollProgress >= 0.14 && scrollProgress <= 0.30) {
      objects.push(...HERO_ABOUT_SHARED_OBJECTS);
    }

    // Corridor 2: About -> Projects (progress 0.40 -> 0.52, world X: 1400..1720)
    if (scrollProgress >= 0.38 && scrollProgress <= 0.54) {
      objects.push(...ABOUT_PROJECTS_SHARED_OBJECTS);
    }

    // Corridor 3: Projects -> Playground (progress 0.62 -> 0.73, world X: 1800..2120)
    if (scrollProgress >= 0.60 && scrollProgress <= 0.76) {
      objects.push(
        { id: 'corridor-p-p-hyacinth', spriteKey: 'lotus_hyacinth_cluster', x: 1880, y: 320, width: 32, height: 24, anchorX: 16, anchorY: 20, layer: 'layer_foreground' }
      );
    }

    // Corridor 4: Playground -> Contact (progress 0.78 -> 0.88, world Y: 1020..1180)
    if (scrollProgress >= 0.76 && scrollProgress <= 0.90) {
      objects.push(...PLAYGROUND_CONTACT_SHARED_OBJECTS);
    }

    return objects;
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
