import { palette } from '../core/PixelPalette';

/**
 * LayerChunkBuilder.js
 * Helpers for pre-rendering static terrain, paths, foliage, and structures onto static chunks.
 */

export class LayerChunkBuilder {
  /**
   * Draw far morning mountain and coconut canopy silhouettes
   */
  static drawFarCanopy(ctx, width, height, yBase = 160) {
    ctx.fillStyle = '#14532d'; // Deep Mekong Green silhouette
    ctx.beginPath();
    ctx.moveTo(0, yBase + 40);

    for (let x = 0; x < width; x += 40) {
      const peak = 16 + Math.sin(x * 0.04) * 14;
      ctx.lineTo(x + 20, yBase + 40 - peak);
      ctx.lineTo(x + 40, yBase + 40);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Morning mist ribbon
    ctx.fillStyle = 'rgba(254, 249, 195, 0.22)';
    ctx.fillRect(0, yBase + 28, width, 24);
  }

  /**
   * Draw static homestead yard with layered earth, grass borders, and brick pathways
   */
  static drawHomesteadGround(ctx, width, height, yBase = 220) {
    // 1. Earth base foundation
    ctx.fillStyle = palette.earth.base;
    ctx.fillRect(0, yBase, width, height - yBase);

    // 2. Lush grass top rim
    ctx.fillStyle = palette.foliage.base;
    ctx.fillRect(0, yBase, width, 8);
    ctx.fillStyle = palette.foliage.highlight;
    ctx.fillRect(0, yBase, width, 2);

    // 3. Earth shading variation
    ctx.fillStyle = palette.earth.shadow;
    ctx.fillRect(0, yBase + 30, width, height - yBase - 30);
  }

  /**
   * Draw static lotus pond water body
   */
  static drawLotusPondBase(ctx, width, height, yBase = 265) {
    // Water base
    ctx.fillStyle = palette.river.base;
    ctx.fillRect(0, yBase, width, height - yBase);

    // Bank water edge rim
    ctx.fillStyle = palette.river.highlight;
    ctx.fillRect(0, yBase, width, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, yBase + 3, width, 1);
  }
}
