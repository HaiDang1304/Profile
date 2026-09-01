/**
 * RiverStrip.js
 * Continuous Mekong river and canal water body across the world canvas.
 */

export class RiverStrip {
  static render(ctx, cameraPos, virtualWidth, virtualHeight, colors, time = 0) {
    const worldStartX = -500;
    const worldWidth = 3200;
    const riverY = 275; // River level

    ctx.save();
    // 1. Water Surface Base Fill
    ctx.fillStyle = colors.riverBase;
    ctx.fillRect(worldStartX, riverY, worldWidth, virtualHeight + 300);

    // 2. Continuous Water Edge Rim
    ctx.fillStyle = colors.riverShimmer;
    ctx.fillRect(worldStartX, riverY, worldWidth, 3);

    // 3. Dynamic Water Shimmer Lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 12; i++) {
      const sx = worldStartX + 40 + (i * 260 + Math.sin(time * 1.5 + i) * 30) % worldWidth;
      const sy = riverY + 12 + (i * 22) % 180;
      ctx.fillRect(Math.round(sx), Math.round(sy), 36, 2);
    }

    ctx.restore();
  }
}
