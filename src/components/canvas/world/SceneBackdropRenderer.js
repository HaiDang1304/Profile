import { loadPixelAsset } from '../core/ImageAssetCache';
import { viewportTransform } from '../core/ViewportTransform';
import { SCENE_BACKDROPS } from '../data/sceneBackdrops';

const TRANSITIONS = [0.14, 0.32, 0.5, 0.68, 0.86];
const TRANSITION_HALF_WIDTH = 0.022;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smootherstep(value) {
  const x = clamp(value, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function getSceneBlend(progress) {
  for (let index = 0; index < TRANSITIONS.length; index += 1) {
    const transition = TRANSITIONS[index];
    if (progress < transition - TRANSITION_HALF_WIDTH) {
      return [{ index, alpha: 1 }];
    }
    if (progress <= transition + TRANSITION_HALF_WIDTH) {
      const mix = smootherstep(
        (progress - transition + TRANSITION_HALF_WIDTH) / (TRANSITION_HALF_WIDTH * 2),
      );
      return [
        { index, alpha: 1 - mix },
        { index: index + 1, alpha: mix },
      ];
    }
  }
  return [{ index: SCENE_BACKDROPS.length - 1, alpha: 1 }];
}

function pixelRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function imagePoint(transform, nx, ny) {
  return {
    x: ((nx * transform.imageWidth - transform.sx) / transform.sw) * transform.viewportWidth,
    y: ((ny * transform.imageHeight - transform.sy) / transform.sh) * transform.viewportHeight,
  };
}

function drawWaterShimmer(ctx, transform, scene, time, strength) {
  if (strength <= 0) return;
  const start = imagePoint(transform, 0, scene.waterLine).y;
  const bottom = imagePoint(transform, 0, 0.98).y;
  if (bottom < 0 || start > transform.viewportHeight) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let index = 0; index < 14; index += 1) {
    const lane = index / 13;
    const y = start + (bottom - start) * lane;
    const cycle = (time * (8 + index % 3) + index * 79) % (transform.viewportWidth + 180);
    const x = cycle - 90;
    const width = 18 + (index % 5) * 9;
    const alpha = (0.05 + (1 - lane) * 0.08) * strength;
    pixelRect(ctx, x, y + Math.sin(time * 1.3 + index) * 2, width, index % 4 === 0 ? 2 : 1, `rgba(255, 244, 190, ${alpha})`);
    pixelRect(ctx, x + transform.viewportWidth * 0.52, y + 7, width * 0.68, 1, `rgba(147, 225, 239, ${alpha * 0.85})`);
  }
  ctx.restore();
}

function drawBird(ctx, x, y, scale, color) {
  pixelRect(ctx, x, y, 4 * scale, 2 * scale, color);
  pixelRect(ctx, x - 3 * scale, y - 2 * scale, 3 * scale, 2 * scale, color);
  pixelRect(ctx, x + 4 * scale, y - 2 * scale, 3 * scale, 2 * scale, color);
}

function drawHeroMotion(ctx, transform, time, energy) {
  const birdOrigin = imagePoint(transform, 0.18, 0.28);
  const count = 2 + Math.round(energy * 7);
  for (let index = 0; index < count; index += 1) {
    const travel = ((time * (12 + index) + index * 43) % 210) - 40;
    drawBird(ctx, birdOrigin.x + travel, birdOrigin.y + Math.sin(time * 1.7 + index) * 13, 1, `rgba(35, 43, 55, ${0.45 + energy * 0.45})`);
  }

  const pond = imagePoint(transform, 0.25, 0.76);
  const petals = 4 + Math.round(energy * 18);
  for (let index = 0; index < petals; index += 1) {
    const phase = time * (0.7 + index % 3 * 0.14) + index * 2.17;
    pixelRect(
      ctx,
      pond.x + Math.cos(phase) * (34 + index * 2.2),
      pond.y - ((time * (8 + index % 4) + index * 17) % 72) + Math.sin(phase * 1.8) * 7,
      index % 2 ? 3 : 4,
      2,
      `rgba(255, 126, 177, ${0.35 + energy * 0.55})`,
    );
  }
}

function drawAboutMotion(ctx, transform, time, energy) {
  const garden = imagePoint(transform, 0.34, 0.48);
  const leafCount = 5 + Math.round(energy * 20);
  for (let index = 0; index < leafCount; index += 1) {
    const travel = (time * (18 + index % 4 * 3) + index * 31) % 300;
    const x = garden.x - 150 + travel;
    const y = garden.y - 90 + ((index * 37) % 145) + Math.sin(time * 2 + index) * 9;
    pixelRect(ctx, x, y, index % 3 === 0 ? 5 : 3, 2, `rgba(158, 222, 83, ${0.28 + energy * 0.55})`);
  }
  const butterfly = imagePoint(transform, 0.62, 0.58);
  const flap = Math.sin(time * 9) > 0 ? 4 : 2;
  pixelRect(ctx, butterfly.x + Math.sin(time) * 24, butterfly.y + Math.cos(time * 1.4) * 13, flap, 3, '#ffe36e');
  pixelRect(ctx, butterfly.x + flap + Math.sin(time) * 24, butterfly.y + Math.cos(time * 1.4) * 13, flap, 3, '#fff2a8');
}

function drawProjectsMotion(ctx, transform, time, energy) {
  const river = imagePoint(transform, 0.44, 0.65);
  const waveCount = 6 + Math.round(energy * 15);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let index = 0; index < waveCount; index += 1) {
    const radius = ((time * (22 + index % 3 * 5) + index * 29) % 170) + 12;
    const alpha = (1 - radius / 190) * (0.13 + energy * 0.32);
    pixelRect(ctx, river.x - radius, river.y + index * 7, radius * 0.72, 2, `rgba(224, 252, 255, ${alpha})`);
    pixelRect(ctx, river.x + radius * 0.28, river.y + index * 7 + 3, radius * 0.42, 1, `rgba(255, 245, 190, ${alpha})`);
  }
  ctx.restore();
}

function drawTechnologyMotion(ctx, transform, time, energy) {
  const screen = imagePoint(transform, 0.16, 0.53);
  const pulse = 0.5 + Math.sin(time * 4) * 0.5;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  pixelRect(ctx, screen.x - 13, screen.y - 10, 42, 25, `rgba(63, 220, 211, ${0.05 + pulse * 0.08 + energy * 0.22})`);
  const motes = 3 + Math.round(energy * 18);
  for (let index = 0; index < motes; index += 1) {
    const phase = time * (1.4 + index % 4 * 0.2) + index;
    const radius = 22 + index * 4;
    pixelRect(ctx, screen.x + Math.cos(phase) * radius, screen.y + Math.sin(phase * 1.2) * radius * 0.55, 3, 3, index % 2 ? '#69f2dc' : '#ffd36a');
  }
  ctx.restore();
}

function drawPixelKite(ctx, x, y, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  pixelRect(ctx, x, y - 8 * scale, 8 * scale, 8 * scale, '#ffe071');
  pixelRect(ctx, x - 8 * scale, y, 8 * scale, 8 * scale, '#f06a57');
  pixelRect(ctx, x + 8 * scale, y, 8 * scale, 8 * scale, '#69d7cf');
  pixelRect(ctx, x, y + 8 * scale, 8 * scale, 8 * scale, '#b48cf2');
  for (let index = 0; index < 5; index += 1) {
    pixelRect(ctx, x + 4 * scale + index * 7, y + 15 * scale + index * 6, 6, 2, '#f7d58b');
  }
  ctx.restore();
}

function drawPlaygroundMotion(ctx, transform, time, energy) {
  const sky = imagePoint(transform, 0.35, 0.24);
  const kiteCount = 1 + Math.round(energy * 3);
  for (let index = 0; index < kiteCount; index += 1) {
    const x = sky.x + index * 74 + Math.sin(time * 0.9 + index) * 24;
    const y = sky.y + index * 31 + Math.cos(time * 1.2 + index) * 14;
    drawPixelKite(ctx, x, y, index === 0 ? 1 : 0.72, 0.75 + energy * 0.25);
  }
}

function drawContactMotion(ctx, transform, time, energy) {
  const stove = imagePoint(transform, 0.16, 0.66);
  const flicker = 0.6 + Math.sin(time * 13) * 0.2 + Math.sin(time * 21) * 0.15;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  pixelRect(ctx, stove.x - 12, stove.y - 17, 28, 35, `rgba(255, 113, 35, ${0.05 + flicker * 0.11 + energy * 0.3})`);
  const sparks = 4 + Math.round(energy * 24);
  for (let index = 0; index < sparks; index += 1) {
    const life = (time * (0.6 + index % 4 * 0.09) + index * 0.17) % 1;
    const spread = 26 + index * 3;
    const x = stove.x + Math.sin(index * 5.3 + time) * spread;
    const y = stove.y - 18 - life * (55 + index % 5 * 8);
    pixelRect(ctx, x, y, life > 0.75 ? 2 : 3, life > 0.75 ? 2 : 3, index % 3 ? '#ffe56e' : '#ff7a3d');
  }
  const fireflies = 7 + Math.round(energy * 18);
  for (let index = 0; index < fireflies; index += 1) {
    const origin = imagePoint(transform, 0.56 + (index % 5) * 0.07, 0.53 + (index % 4) * 0.08);
    const pulse = Math.sin(time * (2 + index % 3) + index * 1.7);
    if (pulse < -0.2) continue;
    pixelRect(ctx, origin.x + Math.sin(time + index) * 14, origin.y + Math.cos(time * 0.7 + index) * 9, 3, 3, `rgba(238, 255, 116, ${0.42 + pulse * 0.28})`);
  }
  ctx.restore();
}

const MOTION_DRAWERS = {
  hero: drawHeroMotion,
  about: drawAboutMotion,
  projects: drawProjectsMotion,
  technology: drawTechnologyMotion,
  playground: drawPlaygroundMotion,
  contact: drawContactMotion,
};

export class SceneBackdropRenderer {
  constructor() {
    this.assets = SCENE_BACKDROPS.map((scene) => loadPixelAsset(
      `scene-backdrop-${scene.id}`,
      scene.src,
      { width: 960, height: 540 },
    ));
    this.pointer = { x: 0, y: 0 };
    this.pointerTarget = { x: 0, y: 0 };
    this.interactionStartedAt = new Map();
  }

  setPointer(x, y) {
    this.pointerTarget.x = clamp(x, -1, 1);
    this.pointerTarget.y = clamp(y, -1, 1);
  }

  trigger(sceneId) {
    this.interactionStartedAt.set(sceneId, performance.now() * 0.001);
  }

  getInteractionEnergy(sceneId, time, reducedMotion) {
    const startedAt = this.interactionStartedAt.get(sceneId);
    if (startedAt === undefined) return 0;
    const duration = reducedMotion ? 0.7 : 2.8;
    const elapsed = time - startedAt;
    if (elapsed >= duration) {
      this.interactionStartedAt.delete(sceneId);
      return 0;
    }
    return smootherstep(1 - elapsed / duration);
  }

  drawAsset(ctx, asset, scene, viewport, time, alpha, reducedMotion) {
    if (!asset.loaded || !asset.canvas || alpha <= 0) return null;
    const imageWidth = asset.canvas.width;
    const imageHeight = asset.canvas.height;
    const zoom = viewport.width < 700 ? 1.075 : 1.035;
    const scale = Math.max(viewport.width / imageWidth, viewport.height / imageHeight) * zoom;
    const sw = viewport.width / scale;
    const sh = viewport.height / scale;
    const drift = reducedMotion ? 0 : Math.sin(time * 0.055 + scene.focalX * 7) * imageWidth * 0.006;
    const pointerX = reducedMotion ? 0 : this.pointer.x * imageWidth * 0.014;
    const pointerY = reducedMotion ? 0 : this.pointer.y * imageHeight * 0.012;
    const sx = clamp(scene.focalX * imageWidth - sw / 2 + drift + pointerX, 0, imageWidth - sw);
    const sy = clamp(imageHeight * 0.5 - sh / 2 + pointerY, 0, imageHeight - sh);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(asset.canvas, sx, sy, sw, sh, 0, 0, viewport.width, viewport.height);
    ctx.restore();

    return { sx, sy, sw, sh, imageWidth, imageHeight, viewportWidth: viewport.width, viewportHeight: viewport.height };
  }

  render(ctx, progress, time, reducedMotion) {
    viewportTransform.applyScreenSpace(ctx);
    const viewport = viewportTransform.getViewportSize();
    const pointerAlpha = reducedMotion ? 1 : 1 - Math.exp(-8 / 60);
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * pointerAlpha;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * pointerAlpha;

    const blend = getSceneBlend(progress);
    let didDraw = false;
    const rendered = [];
    for (const layer of blend) {
      const scene = SCENE_BACKDROPS[layer.index];
      const transform = this.drawAsset(ctx, this.assets[layer.index], scene, viewport, time, layer.alpha, reducedMotion);
      if (transform) {
        didDraw = true;
        rendered.push({ scene, transform, alpha: layer.alpha });
      }
    }

    if (!didDraw) return false;

    for (const item of rendered) {
      ctx.save();
      ctx.globalAlpha = item.alpha;
      const energy = this.getInteractionEnergy(item.scene.id, time, reducedMotion);
      drawWaterShimmer(ctx, item.transform, item.scene, time, 0.75 + energy * 0.8);
      MOTION_DRAWERS[item.scene.id]?.(ctx, item.transform, reducedMotion ? 0 : time, energy);
      ctx.restore();
    }

    const vignette = ctx.createLinearGradient(0, 0, viewport.width, 0);
    vignette.addColorStop(0, 'rgba(3, 8, 14, .12)');
    vignette.addColorStop(0.48, 'rgba(3, 8, 14, 0)');
    vignette.addColorStop(1, 'rgba(3, 8, 14, .12)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
    return true;
  }
}
