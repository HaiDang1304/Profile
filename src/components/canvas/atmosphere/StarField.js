/**
 * StarField.js
 * Twinkling evening & midnight stars across the upper sky dome.
 */

export class StarField {
  constructor() {
    this.type = 'star';
  }

  spawn(p, cameraPos, virtualWidth, virtualHeight, seed) {
    p.type = this.type;
    p.depth = 0.15; // Far background
    p.x = cameraPos.x * p.depth - virtualWidth / 2 + ((seed * 853) % (virtualWidth * 1.8));
    p.y = cameraPos.y * p.depth - virtualHeight / 2 + 15 + ((seed * 491) % 150);
    p.life = 0;
    p.maxLife = 100;
    p.phase = (seed * 6.28);
    p.speed = 1.5 + ((seed * 3) % 3);
    p.isLarge = (seed * 10) % 4 > 2; // 25% large star
  }

  update(p, dt, cameraPos, virtualWidth, virtualHeight, reducedMotion) {
    if (reducedMotion) return;
    p.phase += dt * p.speed;
  }

  render(ctx, p, cameraPos, virtualWidth, virtualHeight) {
    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;
    const screenX = Math.round(p.x - layerCamX + virtualWidth / 2);
    const screenY = Math.round(p.y - layerCamY + virtualHeight / 2);

    if (screenX < 0 || screenX > virtualWidth || screenY < 0 || screenY > virtualHeight) {
      return;
    }

    const twinkle = 0.4 + Math.sin(p.phase) * 0.6;
    if (twinkle < 0.2) return;

    if (p.isLarge) {
      // 4-point cross star
      ctx.fillStyle = `rgba(254, 240, 138, ${(twinkle * 0.4).toFixed(2)})`;
      ctx.fillRect(screenX - 1, screenY, 3, 1);
      ctx.fillRect(screenX, screenY - 1, 1, 3);
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle.toFixed(2)})`;
      ctx.fillRect(screenX, screenY, 1, 1);
    } else {
      // Single bright pixel star
      ctx.fillStyle = `rgba(254, 240, 138, ${twinkle.toFixed(2)})`;
      ctx.fillRect(screenX, screenY, 2, 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle.toFixed(2)})`;
      ctx.fillRect(screenX, screenY, 1, 1);
    }
  }
}
