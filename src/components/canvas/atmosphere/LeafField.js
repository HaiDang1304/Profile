/**
 * LeafField.js
 * Banana leaves and pink lotus petals fluttering gently on the river breeze.
 */

export class LeafField {
  constructor() {
    this.type = 'leaf';
  }

  spawn(p, cameraPos, virtualWidth, virtualHeight, seed) {
    p.type = this.type;
    p.depth = 0.8 + ((seed * 19) % 35) * 0.01; // 0.8 - 1.15
    p.x = cameraPos.x * p.depth - virtualWidth / 2 + ((seed * 719) % (virtualWidth * 1.5));
    p.y = cameraPos.y * p.depth - virtualHeight / 2 + ((seed * 347) % (virtualHeight * 1.2));
    p.vx = 15 + ((seed * 11) % 18);
    p.vy = 18 + ((seed * 13) % 22);
    p.life = 0;
    p.maxLife = 6 + ((seed * 7) % 5);
    p.phase = (seed * 6.28);
    p.isPetal = (seed * 10) % 2 > 1; // 50% banana leaf, 50% lotus petal
    p.frame = 0;
  }

  update(p, dt, cameraPos, virtualWidth, virtualHeight, reducedMotion) {
    if (reducedMotion) return;

    p.life += dt;
    p.phase += dt * 3.5;

    p.x += (p.vx + Math.sin(p.phase) * 14) * dt;
    p.y += p.vy * dt;

    p.frame = Math.floor(p.life * 3) % 3;

    // Reset when out of view or lifetime expired
    const layerCamX = cameraPos.x * p.depth;
    const layerCamY = cameraPos.y * p.depth;

    if (
      p.life >= p.maxLife ||
      p.y - layerCamY > virtualHeight + 40 ||
      p.x - layerCamX > virtualWidth + 60
    ) {
      p.life = 0;
      p.x = layerCamX - virtualWidth / 2 + Math.sin(p.phase) * 60;
      p.y = layerCamY - virtualHeight / 2 - 20;
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

    if (p.isPetal) {
      // Lotus Petal (Pink / Magenta)
      ctx.fillStyle = '#f472b6';
      if (p.frame === 0) {
        ctx.fillRect(screenX, screenY, 3, 2);
      } else if (p.frame === 1) {
        ctx.fillRect(screenX, screenY, 2, 3);
      } else {
        ctx.fillRect(screenX, screenY, 2, 2);
      }
      ctx.fillStyle = '#fdf2f8';
      ctx.fillRect(screenX + 1, screenY, 1, 1);
    } else {
      // Banana Leaf Fragment (Emerald / Lime)
      ctx.fillStyle = '#16a34a';
      if (p.frame === 0) {
        ctx.fillRect(screenX, screenY, 4, 2);
      } else if (p.frame === 1) {
        ctx.fillRect(screenX, screenY, 3, 3);
      } else {
        ctx.fillRect(screenX, screenY, 2, 4);
      }
      ctx.fillStyle = '#86efac';
      ctx.fillRect(screenX, screenY, 1, 1);
    }
  }
}
