import { AnimatedSprite, Assets, Sprite } from 'pixi.js';

/**
 * Adapter for TexturePacker's PixiJS JSON Hash export.
 * Aseprite animation tags should be exported as ordered frame names, for example:
 * character/developer/walk_00 ... character/developer/walk_05.
 */
export class TextureAtlasStore {
  constructor() {
    this.sheet = null;
  }

  async load(manifestUrl) {
    this.sheet = await Assets.load(manifestUrl);
    return this;
  }

  createSprite(frameName) {
    const texture = this.sheet?.textures?.[frameName];
    if (!texture) return null;
    const sprite = new Sprite(texture);
    sprite.texture.source.scaleMode = 'nearest';
    return sprite;
  }

  createAnimation(frameNames, { fps = 8, loop = true } = {}) {
    const textures = frameNames.map((name) => this.sheet?.textures?.[name]).filter(Boolean);
    if (!textures.length) return null;
    const animation = new AnimatedSprite(textures);
    animation.animationSpeed = fps / 60;
    animation.loop = loop;
    animation.texture.source.scaleMode = 'nearest';
    animation.play();
    return animation;
  }

  unload(manifestUrl) {
    if (manifestUrl) Assets.unload(manifestUrl);
    this.sheet = null;
  }
}
