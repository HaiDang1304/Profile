import { drawRect } from '../core/SpriteFactory';

export const aboutSprites = [
  {
    key: 'about_river',
    name: 'Dòng sông (River)',
    scene: 'about',
    category: 'ground', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const w = 120, h = 40;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');
      drawRect(ctx, 0, 0, w, h, '#2d6b70'); // base water
      // flow ripples
      for(let i=0; i<15; i++) {
        const x = (i * 20 + frame * 0.5) % w;
        const y = (i * 11) % h;
        const len = 4 + (i % 6);
        drawRect(ctx, x, y, len, 1, '#438985');
        drawRect(ctx, x + 2, y + 2, len - 2, 1, '#68a6a0');
      }
      return canvas;
    }
  },
  {
    key: 'about_nipa_palm',
    name: 'Bụi dừa nước (Nipa Palm)',
    scene: 'about',
    category: 'landscape', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(48, 48);
      const ctx = canvas.getContext('2d');
      const sway = Math.sin(frame * 0.05) * 2;
      
      // base
      drawRect(ctx, 20, 36, 8, 12, '#3a2719');
      
      // fronds
      ctx.fillStyle = '#397542';
      ctx.beginPath();
      ctx.moveTo(24, 40); ctx.quadraticCurveTo(8 + sway, 16, 4, 24); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(24, 40); ctx.quadraticCurveTo(40 + sway, 16, 44, 24); ctx.fill();
      ctx.fillStyle = '#72a444';
      ctx.beginPath();
      ctx.moveTo(24, 40); ctx.quadraticCurveTo(24 + sway*1.5, 4, 16 + sway, 12); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(24, 40); ctx.quadraticCurveTo(24 + sway*1.5, 4, 32 + sway, 12); ctx.fill();
      
      return canvas;
    }
  },
  {
    key: 'about_fish',
    name: 'Đàn cá (Fishes)',
    scene: 'about',
    category: 'object', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(32, 32);
      const ctx = canvas.getContext('2d');
      for (let i = 0; i < 3; i++) {
         const tailSway = Math.round(Math.sin((frame + i * 10) * 0.3) * 2);
         const x = 10 + i * 8;
         const y = 10 + i * 6;
         drawRect(ctx, x, y, 4, 2, '#e4b344'); // body
         drawRect(ctx, x - 2, y + tailSway, 2, 2, '#e4b344'); // tail
      }
      return canvas;
    }
  },
  {
    key: 'about_bridge',
    name: 'Cầu khỉ (Monkey Bridge)',
    scene: 'about',
    category: 'landscape', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(80, 40);
      const ctx = canvas.getContext('2d');
      // Shadow (swaying slightly with water)
      const sway = Math.round(Math.sin(frame * 0.1) * 1);
      drawRect(ctx, 10 + sway, 35, 60, 2, 'rgba(0,0,0,0.2)');
      drawRect(ctx, 20 + sway, 37, 4, 2, 'rgba(0,0,0,0.2)');
      drawRect(ctx, 60 + sway, 37, 4, 2, 'rgba(0,0,0,0.2)');
      
      // Structure
      drawRect(ctx, 10, 20, 60, 4, '#8b5a2b'); // main log
      drawRect(ctx, 20, 24, 4, 16, '#654321'); // pillar 1
      drawRect(ctx, 60, 24, 4, 16, '#654321'); // pillar 2
      drawRect(ctx, 10, 10, 60, 2, '#a0522d'); // handrail
      drawRect(ctx, 15, 12, 2, 8, '#654321'); // rail support 1
      drawRect(ctx, 40, 12, 2, 8, '#654321'); // rail support 2
      drawRect(ctx, 65, 12, 2, 8, '#654321'); // rail support 3
      return canvas;
    }
  }
];
