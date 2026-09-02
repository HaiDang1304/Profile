export const PIXEL_SIZE = 4; // Scale factor

// Palette definition
const C = {
  _: 'transparent',
  B: '#000000', // Black outline
  W: '#ffffff', // White
  O: '#f97316', // Orange
  G: '#22c55e', // Green
  P: '#ec4899', // Pink
  Y: '#eab308', // Yellow
  U: '#3b82f6', // Blue
  R: '#ef4444', // Red
  D: '#6b7280', // Gray
  br: '#8b5cf6' // Purple
};

export const animalSprites = [
  {
    id: 'cat_orange',
    name: 'Mèo Cam',
    data: [
      "__BB____BB__",
      "_BOOB__BOOB_",
      "BOOOOBBOOOOB",
      "BOOOOOOOOOOB",
      "BOWBBOOOBWOB",
      "BWWBBOWBWWBB",
      "BOOOBBBOOOOB",
      "_BOOOOOOOOB_",
      "__BBOOOOBB__",
      "___BBBBBB___"
    ]
  },
  {
    id: 'dog_gray',
    name: 'Cún Xám',
    data: [
      "___BB__BB___",
      "__BDBBBDBB__",
      "__BDDDDDBB__",
      "__BDDDDDBB__",
      "_BWDBBDWDB__",
      "_BWWDDWWDDB_",
      "_BDDDDDBBDB_",
      "__BDDDDDDB__",
      "__BBDDDDBB__",
      "___BBBBBB___"
    ]
  },
  {
    id: 'frog_green',
    name: 'Ếch Xanh',
    data: [
      "____BB__BB__",
      "___BWWBBWWB_",
      "___BWBBBWBB_",
      "__BGGGGGGB__",
      "_BGGGGGGGGB_",
      "_BGPBGGGBPB_",
      "_BGGGGGGGGB_",
      "__BGGGGGGB__",
      "___BBBBBB___",
      "____________"
    ]
  },
  {
    id: 'pig_pink',
    name: 'Heo Hồng',
    data: [
      "__BB____BB__",
      "_BPPB__BPPB_",
      "_BPPPPPPPPB_",
      "BPPPPPPPPPPB",
      "BWPBPBBPBWPB",
      "BWWPPBBPWWPB",
      "BPPPPPPPPPPB",
      "_BPPBRRBPPB_",
      "__BBPPPPBB__",
      "____BBBB____"
    ]
  },
  {
    id: 'duck_yellow',
    name: 'Vịt Vàng',
    data: [
      "___BBBB_____",
      "__BYYYYB____",
      "__BYWBYB____",
      "_BYYWYYB____",
      "BBRRRYYB____",
      "BBRRRRYB____",
      "_BYYYYYYBB__",
      "__BYYYYYYBB_",
      "___BYYYYBB__",
      "____BBBB____"
    ]
  },
  {
    id: 'dino_blue',
    name: 'Khủng Long',
    data: [
      "____BBBB____",
      "___BUUUUB___",
      "___BWUUUB___",
      "__BWWUUUB___",
      "__BUUUUUBB__",
      "_BUUUUUUUBB_",
      "BUUUUUUUUUB_",
      "BUUBBUUBBBB_",
      "BB__BB______",
      "____________"
    ]
  },
  {
    id: 'fox_orange',
    name: 'Cáo Láu Lỉnh',
    data: [
      "_BB______BB_",
      "BOOB____BOOB",
      "BOOOBB__BOOB",
      "BOOOOBBBOOOB",
      "_BOWBBOBWOB_",
      "_BWWBOWBWWB_",
      "__BWWWWWWB__",
      "___BWWWWB___",
      "____BBBB____",
      "____________"
    ]
  },
  {
    id: 'panda',
    name: 'Gấu Trúc',
    data: [
      "__BB____BB__",
      "_BBBB__BBBB_",
      "_BWWWWWWWWB_",
      "BWWWWWWWWWWB",
      "BBWBBBWWBBWB",
      "BBBWBBWWBBWB",
      "BWWWWWWWWWWB",
      "_BWWWBBWWB__",
      "__BBWWWWBB__",
      "____BBBB____"
    ]
  }
];

export function drawSprite(ctx, spriteData, x, y, size = 4) {
  const data = spriteData.data;
  const rows = data.length;
  const cols = data[0].length;
  
  // Center the sprite
  const startX = x - (cols * size) / 2;
  const startY = y - (rows * size) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const char = data[r][c];
      if (char !== '_') {
        ctx.fillStyle = C[char] || '#000';
        ctx.fillRect(startX + c * size, startY + r * size, size, size);
      }
    }
  }
}
