import { drawRect } from '../core/SpriteFactory';

export const contactSprites = [
  {
    key: 'contact_dark_ground',
    name: 'Nền đất tối (Dark Ground)',
    scene: 'contact',
    category: 'ground', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const w = 120, h = 40;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');
      drawRect(ctx, 0, 10, w, h - 10, '#1c242c'); 
      drawRect(ctx, 0, 5, w, 5, '#283640');
      
      // flickering campfire light on ground
      const flicker = Math.sin(frame * 0.3) * 0.1 + Math.sin(frame * 0.7) * 0.05;
      const radius = 40 + flicker * 10;
      const grad = ctx.createRadialGradient(60, 20, 0, 60, 20, radius);
      grad.addColorStop(0, 'rgba(219, 114, 52, 0.3)');
      grad.addColorStop(1, 'rgba(219, 114, 52, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      
      return canvas;
    }
  },
  {
    key: 'contact_bamboo',
    name: 'Rặng tre (Bamboo)',
    scene: 'contact',
    category: 'landscape', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(64, 80);
      const ctx = canvas.getContext('2d');
      
      for(let i=0; i<4; i++) {
         const bx = 10 + i * 14;
         const sway = Math.round(Math.sin((frame + i*10) * 0.05) * 3);
         
         // segments
         for(let s=0; s<6; s++) {
            const sy = 70 - s*12;
            const curSway = (s/6) * sway;
            drawRect(ctx, bx + curSway, sy, 4, 10, '#2b4433');
            drawRect(ctx, bx - 1 + curSway, sy - 2, 6, 2, '#486e4f'); // joint
         }
         
         // leaves
         if (i % 2 === 0) {
            drawRect(ctx, bx + sway - 6, 20, 8, 2, '#1b3023');
            drawRect(ctx, bx + sway + 4, 30, 10, 2, '#1b3023');
         }
      }
      
      return canvas;
    }
  },
  {
    key: 'contact_campfire',
    name: 'Lửa trại & Đom đóm (Campfire)',
    scene: 'contact',
    category: 'object', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(64, 64);
      const ctx = canvas.getContext('2d');
      
      // logs
      drawRect(ctx, 20, 50, 24, 6, '#281a17');
      drawRect(ctx, 24, 46, 16, 6, '#3a241e');
      
      // fire
      for (let i = 0; i < 5; i++) {
        const height = 10 + Math.random() * 15 + Math.sin(frame * 0.5 + i) * 5;
        const fx = 26 + i * 3;
        drawRect(ctx, fx, 50 - height, 3, height, '#db4125');
        drawRect(ctx, fx + 1, 50 - height + 2, 1, height - 4, '#f2a640');
      }
      
      // sparks & fireflies
      for (let i = 0; i < 8; i++) {
         const isFirefly = i > 4;
         const phase = (frame + i * 17) % 60;
         const life = phase / 60;
         const x = 32 + Math.sin(phase * 0.2 + i) * 20;
         const y = 50 - life * 50;
         
         if (isFirefly) {
            const blink = phase % 20 < 10;
            if (blink) drawRect(ctx, x, y, 2, 2, '#bdf46d');
         } else {
            drawRect(ctx, x, y, 2, 2, '#f2a640');
         }
      }
      
      return canvas;
    }
  }
];
