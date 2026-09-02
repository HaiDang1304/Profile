import { drawRect } from '../core/SpriteFactory';

export const playgroundSprites = [
  {
    key: 'playground_sunset_water',
    name: 'Mặt nước lấp lánh (Sunset Water)',
    scene: 'playground',
    category: 'ground', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const w = 120, h = 40;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');
      drawRect(ctx, 0, 0, w, h, '#905156'); // base water
      
      // shimmering light
      for (let i = 0; i < 20; i++) {
        const x = (i * 17 + frame * 0.2) % w;
        const y = (i * 9) % h;
        const shimmer = (frame + i * 5) % 30 < 15;
        if (shimmer) {
           drawRect(ctx, x, y, 4, 1, '#f3a45e');
           drawRect(ctx, x + 2, y + 1, 2, 1, '#ffc785');
        } else {
           drawRect(ctx, x, y, 4, 1, '#b06560');
        }
      }
      return canvas;
    }
  },
  {
    key: 'playground_hut',
    name: 'Chòi lá (Thatch Hut)',
    scene: 'playground',
    category: 'landscape', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(80, 80);
      const ctx = canvas.getContext('2d');
      
      // supports
      drawRect(ctx, 16, 40, 4, 40, '#49302a');
      drawRect(ctx, 60, 40, 4, 40, '#49302a');
      
      // roof base
      ctx.fillStyle = '#6e4533';
      ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(70, 40); ctx.lineTo(10, 40); ctx.fill();
      
      // thatch leaves with wind
      const wind = Math.round(Math.sin(frame * 0.1) * 2);
      ctx.fillStyle = '#9c6c45';
      for(let i=0; i<8; i++) {
         const lx = 15 + i*7;
         drawRect(ctx, lx, 35, 6, 8 + (i%3) * 2, '#9c6c45');
         drawRect(ctx, lx + wind, 40, 4, 6, '#b58557');
      }
      
      // lantern
      const swing = Math.round(Math.sin(frame * 0.15) * 3);
      drawRect(ctx, 40, 40, 2, 10, '#333');
      drawRect(ctx, 36 + swing, 50, 10, 14, '#d84b3e');
      drawRect(ctx, 38 + swing, 52, 6, 10, '#f4d360');
      
      return canvas;
    }
  },
  {
    key: 'playground_fishing_rod',
    name: 'Cần câu & Phao (Fishing Rod)',
    scene: 'playground',
    category: 'object', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(64, 64);
      const ctx = canvas.getContext('2d');
      
      // rod
      ctx.strokeStyle = '#5b3428';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(60, 60); ctx.quadraticCurveTo(30, 20, 10, 10); ctx.stroke();
      
      // line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      const bobY = Math.round(Math.sin(frame * 0.08) * 3);
      ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(10, 40 + bobY); ctx.stroke();
      
      // bobber
      drawRect(ctx, 8, 40 + bobY, 4, 4, '#ef6455');
      drawRect(ctx, 8, 44 + bobY, 4, 4, '#ffffff');
      
      // ripples
      const rippleSize = (frame % 60) / 4;
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - rippleSize/15})`;
      ctx.beginPath();
      ctx.ellipse(10, 48 + bobY, rippleSize * 2, rippleSize, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      return canvas;
    }
  }
];
