import { drawRect } from '../core/SpriteFactory';

export const projectsSprites = [
  {
    key: 'projects_mudbank',
    name: 'Bờ kè đất bùn (Mud Bank)',
    scene: 'projects',
    category: 'ground', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const w = 120, h = 40;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext('2d');
      drawRect(ctx, 0, 15, w, h - 15, '#784828'); // mud
      drawRect(ctx, 0, 10, w, 5, '#347343'); // top grass
      
      // ripples touching mud
      for (let i = 0; i < 5; i++) {
        const x = (i * 25 + frame * 0.3) % w;
        drawRect(ctx, x, 14, 6, 1, '#2f7e91');
      }
      return canvas;
    }
  },
  {
    key: 'projects_mangrove',
    name: 'Rặng bần ven sông (Mangrove)',
    scene: 'projects',
    category: 'landscape', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(64, 64);
      const ctx = canvas.getContext('2d');
      
      // roots
      drawRect(ctx, 20, 40, 4, 20, '#533322');
      drawRect(ctx, 40, 42, 4, 18, '#533322');
      drawRect(ctx, 16, 45, 6, 4, '#a76631');
      drawRect(ctx, 36, 48, 8, 4, '#a76631');
      
      // leaves
      const sway = Math.round(Math.sin(frame * 0.08) * 1);
      ctx.fillStyle = '#246047';
      ctx.beginPath(); ctx.arc(32 + sway, 24, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38715e';
      ctx.beginPath(); ctx.arc(28 + sway, 20, 16, 0, Math.PI * 2); ctx.fill();
      
      // fireflies in mangrove
      const blink = (frame % 40) < 20 ? 1 : 0;
      if (blink) {
         drawRect(ctx, 24 + sway, 24, 2, 2, '#fff5c7');
         drawRect(ctx, 40 + sway, 30, 2, 2, '#fff5c7');
      }
      
      return canvas;
    }
  },
  {
    key: 'projects_boat',
    name: 'Xuồng máy rẽ sóng (Motorboat)',
    scene: 'projects',
    category: 'object', width: 120, height: 120, description: 'Updated detailed procedural sprite', layer: 'base', animated: true, frameCount: 60, anchorX: 0, anchorY: 0,
    factory: (createCanvas, frame) => {
      const canvas = createCanvas(64, 32);
      const ctx = canvas.getContext('2d');
      const bobY = Math.round(Math.sin(frame * 0.1) * 1);
      
      // boat body
      drawRect(ctx, 10, 14 + bobY, 40, 8, '#e25b42'); // base
      drawRect(ctx, 14, 10 + bobY, 32, 4, '#f1b642'); // top rim
      drawRect(ctx, 46, 12 + bobY, 6, 6, '#4b9fb4'); // motor
      
      // propeller splash
      if (frame % 4 < 2) {
        drawRect(ctx, 52, 16 + bobY, 4, 4, '#ffffff');
        drawRect(ctx, 56, 18 + bobY, 3, 2, '#8cd3e6');
      } else {
        drawRect(ctx, 52, 18 + bobY, 5, 3, '#ffffff');
      }
      
      // front wave
      drawRect(ctx, 4, 20 + bobY, 8, 2, '#ffffff');
      drawRect(ctx, 0, 22 + bobY, 6, 2, '#8cd3e6');
      
      return canvas;
    }
  }
];
