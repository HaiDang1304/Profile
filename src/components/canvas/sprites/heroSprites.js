import { drawRect } from '../core/SpriteFactory';

export const heroSprites = [
  {
    key: 'hero_ground_grass',
    name: 'Nền đất cỏ (Grass Ground)',
    scene: 'hero',
    category: 'ground', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const w = 120, h = 40;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');
      drawRect(ctx, 0, 10, w, h - 10, '#36533d');
      drawRect(ctx, 0, 5, w, 5, '#456a4b');
      for (let i = 0; i < 30; i++) {
         const x = (i * 13) % w;
         const y = 3 + (i * 7) % 15;
         const sway = Math.round(Math.sin((frame + i) * 0.1) * 1);
         drawRect(ctx, x + sway, y, 2, 4, '#57835b');
         drawRect(ctx, x - 1 + sway, y + 2, 4, 2, '#456a4b');
      }
      return canvas;
    }
  },
  {
    key: 'hero_mango_tree',
    name: 'Cây xoài (Mango Tree)',
    scene: 'hero',
    category: 'landscape', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(64, 80);
      const ctx = canvas.getContext('2d');
      drawRect(ctx, 28, 40, 8, 40, '#4a3424');
      drawRect(ctx, 26, 75, 12, 5, '#3b2819');
      const sway = Math.round(Math.sin(frame * 0.05) * 2);
      ctx.fillStyle = '#2f5a34';
      ctx.beginPath(); ctx.arc(32 + sway, 30, 24, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#417a46';
      ctx.beginPath(); ctx.arc(28 + sway, 24, 18, 0, Math.PI * 2); ctx.fill();
      for(let i=0; i<5; i++){
          const fx = 20 + (i*11)%20 + sway;
          const fy = 20 + (i*7)%20;
          drawRect(ctx, fx, fy, 3, 4, '#e6c84c');
      }
      return canvas;
    }
  },
  {
    key: 'hero_chickens',
    name: 'Bầy gà (Chickens)',
    scene: 'hero',
    category: 'object', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(40, 20);
      const ctx = canvas.getContext('2d');
      const peck1 = frame % 30 < 10 ? 1 : 0; 
      const peck2 = (frame + 15) % 40 < 10 ? 1 : 0; 
      drawRect(ctx, 5, 10 + peck1, 8, 6, '#ffffff'); 
      drawRect(ctx, 11, 8 + peck1*3, 4, 4, '#ffffff'); 
      drawRect(ctx, 15, 9 + peck1*3, 2, 2, '#f2a640'); 
      drawRect(ctx, 12, 6 + peck1*3, 2, 2, '#e03a3a'); 
      drawRect(ctx, 7, 16, 2, 2, '#f2a640'); 
      drawRect(ctx, 25, 12 + peck2, 6, 5, '#d38b42');
      drawRect(ctx, 23, 10 + peck2*2, 3, 3, '#d38b42');
      drawRect(ctx, 21, 11 + peck2*2, 2, 2, '#f2a640');
      return canvas;
    }
  },
  {
    key: 'hero_smoke',
    name: 'Khói bếp (Smoke)',
    scene: 'hero',
    category: 'object', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(32, 64);
      const ctx = canvas.getContext('2d');
      for(let i=0; i<4; i++){
         const phase = (frame + i*15) % 60;
         const y = 60 - phase;
         const x = 16 + Math.sin(phase * 0.1) * (phase/10);
         const size = 4 + (phase/8);
         const alpha = Math.max(0, 1 - (phase/60));
         ctx.fillStyle = `rgba(200, 200, 200, ${alpha * 0.5})`;
         ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      }
      return canvas;
    }
  }
];
