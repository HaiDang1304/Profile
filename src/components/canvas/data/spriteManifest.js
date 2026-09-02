import { spriteCache } from '../core/SpriteCache';
import { heroSprites } from '../sprites/heroSprites';
import { aboutSprites } from '../sprites/aboutSprites';
import { projectsSprites } from '../sprites/projectsSprites';
import { playgroundSprites } from '../sprites/playgroundSprites';
import { contactSprites } from '../sprites/contactSprites';

export const SPRITE_MANIFEST = [
  ...heroSprites,
  ...aboutSprites,
  ...projectsSprites,
  ...playgroundSprites,
  ...contactSprites,
];

export function registerAllSprites() {
  SPRITE_MANIFEST.forEach((sprite) => {
    spriteCache.register(sprite.key, sprite.factory);
  });
}
