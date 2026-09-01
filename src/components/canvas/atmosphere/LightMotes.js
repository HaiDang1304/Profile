/**
 * LightMotes.js
 * Glowing dust specks & golden morning sun motes suspended in the air.
 */

export class LightMotes {
  constructor() {
    this.type = 'lightMote';
  }

  spawn(p, cameraPos, virtualWidth, virtualHeight, seed) {
    p.type = this.type;
    p.depth = 0.6 + ((seed * 13) % 40) * 0.01; // 0.6 - 1.0
    p.x = cameraPos.x * p.depth - virtualWidth / 2 + ((seed * 641) % (virtualWidth * 1.5));
    p.y = cameraPos.y * p.depth - virtualHeight / 2 + ((seed * 409) % (virtualHeight * 1.2));
    p.vx = 4 + ((seed * 5) % 8);
    p.vy = -6 - ((seed * 7) % 10);
    p.life = 0;
    p.maxLife = 4 + ((seed * 3) % 4);
    p.phase = (seed * 6.28);
  }

  update(p, dt, cameraPos, virtualWidth, virtualHeight, reducedMotion) {
    if (reducedMotion) return;

    p.life += dt;
    p.phase += dt * 2.0;

    p.x += (p.vx + Math.sin(p.phase) * 6) * dt;
    p.y += (p.vy + Math.cos(p.phase * 0.7) * 4) * dt;

    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;

    if (
      p.life >= p.maxLife ||
      p.y - layerCamY < -40 ||
      p.x - layerCamX > virtualWidth + 40
    ) {
      p.life = 0;
      p.x = layerCamX - virtualWidth / 2 + ((p.phase * 100) % virtualWidth);
      p.y = layerCamY + virtualHeight / 2 + 20;
    }
  }

  render(ctx, p, cameraPos, virtualWidth, virtualHeight) {
    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;
    const screenX = Math.round(p.x - layerCamX + virtualWidth / 2);
    const screenY = Math.round(p.y - layerCamY + virtualHeight / 2);

    if (screenX < -10 || screenX > virtualWidth + 10 || screenY < -10 || screenY > virtualHeight + 10) {
      return;
    }

    const pulse = 0.5 + Math.sin(p.phase * 3.0) * 0.5;
    const alpha = (pulse * 0.75).toFixed(2);

    ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.fillRect(screenX, screenY, 2, 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(screenX, screenY, 1, 1);
  }
}
