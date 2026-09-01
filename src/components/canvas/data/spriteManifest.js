import { spriteCache } from '../core/SpriteCache';

export const SPRITE_MANIFEST = [];

export function registerAllSprites() {
  SPRITE_MANIFEST.forEach((sprite) => {
    spriteCache.register(sprite.key, sprite.factory);
  });
}
