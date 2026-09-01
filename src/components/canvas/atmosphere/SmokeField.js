/**
 * SmokeField.js
 * Subtle smoke puffs and glowing fire embers rising from the brick stove in the Contact scene.
 */

export class SmokeField {
  constructor() {
    this.type = 'smoke';
  }

  spawn(p, cameraPos, virtualWidth, virtualHeight, seed) {
    p.type = this.type;
    p.depth = 1.0; // Main world layer
    // Originates near the brick stove (x: ~640, y: ~1475)
    p.x = 638 + ((seed * 7) % 6);
    p.y = 1475 + ((seed * 11) % 4);
    p.vx = 2 + ((seed * 5) % 6);
    p.vy = -18 - ((seed * 9) % 12);
    p.life = 0;
    p.maxLife = 2.5 + ((seed * 3) % 2);
    p.isSpark = (seed * 10) % 3 === 0; // 33% glowing ember spark
    p.size = p.isSpark ? 1 : (2 + Math.floor((seed * 5) % 3));
  }

  update(p, dt, cameraPos, virtualWidth, virtualHeight, reducedMotion) {
    if (reducedMotion) return;

    p.life += dt;

    // Slight wind sway
    p.x += (p.vx + Math.sin(p.life * 3.0) * 4) * dt;
    p.y += p.vy * dt;

    if (p.life >= p.maxLife) {
      p.life = 0;
      p.x = 638 + (Math.random() * 6);
      p.y = 1475 + (Math.random() * 4);
    }
  }

  render(ctx, p, cameraPos, virtualWidth, virtualHeight) {
    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;
    const screenX = Math.round(p.x - layerCamX + virtualWidth / 2);
    const screenY = Math.round(p.y - layerCamY + virtualHeight / 2);

    if (screenX < -20 || screenX > virtualWidth + 20 || screenY < -20 || screenY > virtualHeight + 20) {
      return;
    }

    const lifeRatio = 1 - (p.life / p.maxLife);

    if (p.isSpark) {
      // Golden / Orange glowing ember
      ctx.fillStyle = `rgba(251, 146, 60, ${(lifeRatio * 0.9).toFixed(2)})`;
      ctx.fillRect(screenX, screenY, 2, 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${(lifeRatio).toFixed(2)})`;
      ctx.fillRect(screenX, screenY, 1, 1);
    } else {
      // Gray / White rising smoke puff
      const expand = Math.floor((1 - lifeRatio) * 4);
      const alpha = (lifeRatio * 0.45).toFixed(2);
      ctx.fillStyle = `rgba(203, 213, 225, ${alpha})`;
      ctx.fillRect(screenX - expand / 2, screenY - expand / 2, p.size + expand, p.size + expand);
    }
  }
}
