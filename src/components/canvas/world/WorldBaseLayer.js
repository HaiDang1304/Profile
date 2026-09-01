import { WorldPaletteTrack } from './WorldPaletteTrack';
import { viewportTransform } from '../core/ViewportTransform';

/** Draws the one continuous sky, horizon and river shared by every scene. */
export class WorldBaseLayer {
  static render(ctx, scrollProgress, cameraPos, time = 0) {
    const colors = WorldPaletteTrack.sample(scrollProgress);
    viewportTransform.applyScreenSpace(ctx);
    const viewport = viewportTransform.getViewportSize();
    const horizonY = Math.round(viewport.height * 0.54);

    const sky = ctx.createLinearGradient(0, 0, 0, horizonY + 1);
    sky.addColorStop(0, colors.skyTop);
    sky.addColorStop(0.58, colors.skyMid);
    sky.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, viewport.width, horizonY + 2);

    const water = ctx.createLinearGradient(0, horizonY - 2, 0, viewport.height);
    water.addColorStop(0, colors.riverShimmer);
    water.addColorStop(0.025, colors.riverBase);
    water.addColorStop(0.62, colors.riverBase);
    water.addColorStop(1, colors.skyTop);
    ctx.fillStyle = water;
    ctx.fillRect(0, horizonY, viewport.width, viewport.height - horizonY);

    // Smooth Distant Tree Ridge Silhouette on Horizon (Rặng cây xa dither mượt mà)
    ctx.fillStyle = 'rgba(20, 83, 45, 0.45)'; // Soft deep green
    ctx.beginPath();
    ctx.moveTo(0, horizonY + 4);
    for (let x = 0; x <= viewport.width + 30; x += 30) {
      const wave = Math.sin(x * 0.02 + cameraPos.x * 0.001) * 6;
      ctx.lineTo(x + 15, horizonY - 4 - wave);
      ctx.lineTo(x + 30, horizonY + 2);
    }
    ctx.lineTo(viewport.width, horizonY + 8);
    ctx.lineTo(0, horizonY + 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    for (let index = 0; index < 10; index += 1) {
      const y = horizonY + 18 + index * Math.max(12, Math.round((viewport.height - horizonY) / 12));
      const waveX = Math.round(((index * 173 + time * (index % 2 ? 4 : -3)) % (viewport.width + 160)) - 80);
      const waveWidth = 28 + (index % 4) * 18;
      ctx.fillRect(waveX, y, waveWidth, index < 3 ? 1 : 2);
      ctx.fillRect(waveX + Math.round(viewport.width * 0.58), y + 5, Math.max(18, waveWidth - 8), 1);
    }
  }
}
