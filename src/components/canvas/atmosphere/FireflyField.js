/**
 * FireflyField.js
 * Glowing Mekong fireflies wandering organically around river vegetation and the fishing hut.
 */

export class FireflyField {
  constructor() {
    this.type = 'firefly';
  }

  spawn(p, cameraPos, virtualWidth, virtualHeight, seed) {
    p.type = this.type;
    p.depth = 0.85 + ((seed * 17) % 25) * 0.01; // 0.85 - 1.10
    // Cluster around vegetation & riverbank
    p.x = cameraPos.x * p.depth - virtualWidth / 4 + ((seed * 523) % (virtualWidth * 1.2));
    p.y = cameraPos.y * p.depth + ((seed * 281) % (virtualHeight * 0.7));
    p.vx = (Math.sin(seed * 4.1) * 12);
    p.vy = (Math.cos(seed * 3.7) * 8);
    p.life = 0;
    p.maxLife = 8 + ((seed * 5) % 6);
    p.phase = (seed * 6.28);
    p.pulseSpeed = 2.0 + ((seed * 7) % 3);
  }

  update(p, dt, cameraPos, virtualWidth, virtualHeight, reducedMotion) {
    if (reducedMotion) return;

    p.life += dt;
    p.phase += dt * p.pulseSpeed;

    // Smooth erratic wandering
    p.x += (p.vx + Math.sin(p.life * 1.7) * 10) * dt;
    p.y += (p.vy + Math.cos(p.life * 1.3) * 8) * dt;

    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;

    if (
      p.life >= p.maxLife ||
      Math.abs(p.x - layerCamX) > virtualWidth ||
      Math.abs(p.y - layerCamY) > virtualHeight
    ) {
      p.life = 0;
      p.x = layerCamX + (Math.sin(p.phase) * (virtualWidth / 2));
      p.y = layerCamY + (Math.cos(p.phase) * (virtualHeight / 3));
    }
  }

  render(ctx, p, cameraPos, virtualWidth, virtualHeight) {
    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;
    const screenX = Math.round(p.x - layerCamX + virtualWidth / 2);
    const screenY = Math.round(p.y - layerCamY + virtualHeight / 2);

    if (screenX < -15 || screenX > virtualWidth + 15 || screenY < -15 || screenY > virtualHeight + 15) {
      return;
    }

    const pulse = 0.5 + Math.sin(p.phase) * 0.5;
    if (pulse < 0.15) return; // Blink off

    // 1. Outer Soft Green Halo
    ctx.fillStyle = `rgba(163, 230, 53, ${(pulse * 0.35).toFixed(2)})`;
    ctx.fillRect(screenX - 2, screenY - 2, 6, 6);

    // 2. Mid Warm Glow Core
    ctx.fillStyle = `rgba(234, 179, 8, ${(pulse * 0.75).toFixed(2)})`;
    ctx.fillRect(screenX - 1, screenY - 1, 4, 4);

    // 3. Bright White Center
    ctx.fillStyle = `rgba(255, 255, 255, ${(pulse * 0.95).toFixed(2)})`;
    ctx.fillRect(screenX, screenY, 2, 2);
  }
}
