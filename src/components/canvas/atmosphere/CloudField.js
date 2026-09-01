/**
 * CloudField.js
 * Atmospheric pixel clouds drifting across the upper horizon.
 */

export class CloudField {
  constructor() {
    this.type = 'cloud';
  }

  spawn(p, cameraPos, virtualWidth, virtualHeight, seed) {
    p.type = this.type;
    p.depth = 0.25;
    p.width = 72 + Math.floor((seed * 37) % 64);
    p.height = 18 + Math.floor((seed * 23) % 12);
    p.x = cameraPos.x * p.depth - virtualWidth / 2 + ((seed * 893) % (virtualWidth * 2));
    p.y = cameraPos.y * p.depth - virtualHeight / 2 + 34 + ((seed * 431) % 115);
    p.vx = 4 + ((seed * 17) % 6);
    p.vy = 0;
    p.life = 0;
    p.maxLife = 120;
    p.alpha = 0.8;
  }

  update(p, dt, cameraPos, virtualWidth, virtualHeight, reducedMotion) {
    if (reducedMotion) return;

    p.x += p.vx * dt;

    // Wrap around camera viewport
    const layerCamX = cameraPos.x * p.depth;
    if (p.x - layerCamX > virtualWidth + 100) {
      p.x = layerCamX - virtualWidth / 2 - p.width - 20;
    }
  }

  render(ctx, p, cameraPos, virtualWidth, virtualHeight, progress) {
    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;
    const screenX = Math.round(p.x - layerCamX + virtualWidth / 2);
    const screenY = Math.round(p.y - layerCamY + virtualHeight / 2);

    // Dynamic tint based on scrollProgress
    let baseColor = 'rgba(255, 250, 231, 0.2)';
    let highlightColor = 'rgba(255, 255, 255, 0.16)';
    let shadowColor = 'rgba(148, 163, 184, 0.12)';

    if (progress >= 0.70) {
      baseColor = 'rgba(176, 118, 190, 0.13)';
      highlightColor = 'rgba(255, 174, 137, 0.12)';
      shadowColor = 'rgba(30, 27, 75, 0.15)';
    } else if (progress >= 0.45) {
      baseColor = 'rgba(255, 218, 156, 0.15)';
      highlightColor = 'rgba(255, 244, 214, 0.13)';
      shadowColor = 'rgba(122, 68, 48, 0.1)';
    }

    const w = p.width;
    const h = p.height;
    ctx.fillStyle = baseColor;
    ctx.fillRect(screenX + Math.round(w * 0.08), screenY + Math.round(h * 0.48), Math.round(w * 0.84), Math.round(h * 0.34));
    ctx.fillRect(screenX + Math.round(w * 0.2), screenY + Math.round(h * 0.25), Math.round(w * 0.62), Math.round(h * 0.36));
    ctx.fillRect(screenX + Math.round(w * 0.34), screenY + Math.round(h * 0.05), Math.round(w * 0.28), Math.round(h * 0.34));
    ctx.fillRect(screenX + Math.round(w * 0.13), screenY + Math.round(h * 0.39), Math.round(w * 0.2), Math.round(h * 0.23));
    ctx.fillRect(screenX + Math.round(w * 0.7), screenY + Math.round(h * 0.4), Math.round(w * 0.2), Math.round(h * 0.22));

    ctx.fillStyle = highlightColor;
    ctx.fillRect(screenX + Math.round(w * 0.37), screenY + Math.round(h * 0.05), Math.round(w * 0.19), 2);
    ctx.fillRect(screenX + Math.round(w * 0.22), screenY + Math.round(h * 0.25), Math.round(w * 0.22), 2);

    ctx.fillStyle = shadowColor;
    ctx.fillRect(screenX + Math.round(w * 0.16), screenY + Math.round(h * 0.82), Math.round(w * 0.68), Math.max(2, Math.round(h * 0.12)));
    ctx.fillRect(screenX + Math.round(w * 0.28), screenY + Math.round(h * 0.7), Math.round(w * 0.44), 2);
  }
}
