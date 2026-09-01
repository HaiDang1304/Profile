import { cameraPath } from '../data/cameraPath';

const ZONES = [
  {
    id: 'hero',
    name: '1. HERO ZONE',
    desc: 'Hiên Nhà & Ao Sen (Bình Minh)',
    x: 0,
    y: 180,
    w: 800,
    h: 500,
    bg: '#fef9c3',
    accent: '#ca8a04',
    border: '#eab308',
  },
  {
    id: 'about',
    name: '2. ABOUT ZONE',
    desc: 'Cầu Khỉ & Mương Dừa (Buổi Sáng)',
    x: 1100,
    y: 180,
    w: 800,
    h: 500,
    bg: '#dcfce7',
    accent: '#16a34a',
    border: '#22c55e',
  },
  {
    id: 'projects',
    name: '3. PROJECTS ZONE',
    desc: 'Bến Xuồng Ba Lá (Hoàng Hôn)',
    x: 280,
    y: 620,
    w: 800,
    h: 500,
    bg: '#ffedd5',
    accent: '#ea580c',
    border: '#f97316',
  },
  {
    id: 'playground',
    name: '4. PLAYGROUND ZONE',
    desc: 'Chòi Lá Câu Cá (Chạng Vạng)',
    x: 1280,
    y: 1020,
    w: 800,
    h: 500,
    bg: '#f3e8ff',
    accent: '#9333ea',
    border: '#a855f7',
  },
  {
    id: 'contact',
    name: '5. CONTACT ZONE',
    desc: 'Bếp Củi & Đêm Trăng (Đêm Khuya)',
    x: 520,
    y: 1500,
    w: 800,
    h: 500,
    bg: '#0f172a',
    accent: '#38bdf8',
    border: '#0284c7',
  },
];

export class DebugWorldRenderer {
  render(ctx, cameraPos, viewportWidth, viewportHeight, scrollProgress, fps = 60) {
    const camX = cameraPos.x;
    const camY = cameraPos.y;

    // Viewport Center Offset so camera focuses on (camX, camY)
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;

    // Clear whole screen with neutral dark blueprint canvas
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

    ctx.save();
    // Transform coordinate system by camera position
    ctx.translate(centerX - camX, centerY - camY);

    // 1. Draw Global World Grid Lines (100px & 50px)
    this.drawWorldGrid(ctx, -500, -200, 2400, 2200);

    // 2. Draw Connected Camera Path & Waypoints
    this.drawCameraPath(ctx);

    // 3. Draw 5 Colored Debug Zones
    ZONES.forEach((zone) => {
      this.drawZone(ctx, zone);
    });

    // 4. Draw Current Camera Reticle Marker
    this.drawCameraReticle(ctx, camX, camY);

    ctx.restore();

    // 5. Screen-Space Diagnostic HUD
    this.drawHUD(ctx, cameraPos, scrollProgress, viewportWidth, viewportHeight, fps);
  }

  drawWorldGrid(ctx, minX, minY, maxX, maxY) {
    // 50px minor grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = minX; x <= maxX; x += 50) {
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
    }
    for (let y = minY; y <= maxY; y += 50) {
      ctx.moveTo(minX, y);
      ctx.lineTo(maxX, y);
    }
    ctx.stroke();

    // 200px major grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = minX; x <= maxX; x += 200) {
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
    }
    for (let y = minY; y <= maxY; y += 200) {
      ctx.moveTo(minX, y);
      ctx.lineTo(maxX, y);
    }
    ctx.stroke();
  }

  drawCameraPath(ctx) {
    // Camera spline path track
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    cameraPath.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Path directional arrows & labels
    for (let i = 0; i < cameraPath.length - 1; i++) {
      const p1 = cameraPath[i];
      const p2 = cameraPath[i + 1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-8, -8);
      ctx.lineTo(-8, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  drawZone(ctx, z) {
    const left = z.x - z.w / 2;
    const top = z.y - z.h / 2;

    // Zone Background
    ctx.fillStyle = z.bg;
    ctx.fillRect(left, top, z.w, z.h);

    // Zone Border
    ctx.strokeStyle = z.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(left, top, z.w, z.h);

    // Waypoint Crosshair at Zone Center (target x, y)
    ctx.strokeStyle = z.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(z.x - 30, z.y);
    ctx.lineTo(z.x + 30, z.y);
    ctx.moveTo(z.x, z.y - 30);
    ctx.lineTo(z.x, z.y + 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(z.x, z.y, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Zone Labels
    ctx.fillStyle = z.id === 'contact' ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 26px monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(z.name, z.x, z.y - 80);

    ctx.font = '16px monospace, sans-serif';
    ctx.fillStyle = z.accent;
    ctx.fillText(z.desc, z.x, z.y - 50);

    ctx.font = 'bold 15px monospace, sans-serif';
    ctx.fillStyle = z.id === 'contact' ? '#cbd5e1' : '#334155';
    ctx.fillText(`Target: (${z.x}, ${z.y})`, z.x, z.y + 60);
  }

  drawCameraReticle(ctx, camX, camY) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(camX, camY, 24, 0, Math.PI * 2);
    ctx.moveTo(camX - 35, camY);
    ctx.lineTo(camX + 35, camY);
    ctx.moveTo(camX, camY - 35);
    ctx.lineTo(camX, camY + 35);
    ctx.stroke();
  }

  drawHUD(ctx, cameraPos, scrollProgress, w, h, fps) {
    const pad = 16;
    const boxW = 290;
    const boxH = 145;

    // HUD Box Top-Left
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fillRect(pad, pad, boxW, boxH);
    ctx.strokeRect(pad, pad, boxW, boxH);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CAMERA 2D ENGINE (PHASE 0)', pad + 12, pad + 24);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px monospace, sans-serif';
    ctx.fillText(`Scroll Progress: ${(scrollProgress * 100).toFixed(1)}%`, pad + 12, pad + 48);
    ctx.fillText(`Camera Pos:     X=${cameraPos.x}, Y=${cameraPos.y}`, pad + 12, pad + 70);
    ctx.fillText(`Target Pos:     X=${Math.round(cameraPos.targetX)}, Y=${Math.round(cameraPos.targetY)}`, pad + 12, pad + 92);
    ctx.fillText(`FPS:            ${fps} FPS (Single RAF)`, pad + 12, pad + 114);
    ctx.fillText(`Pixel Snap:     ACTIVE (Integer Coords)`, pad + 12, pad + 134);
  }
}
