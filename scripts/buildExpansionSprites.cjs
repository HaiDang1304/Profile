const fs = require('fs');
const path = require('path');

const code = `import { drawPixelMatrix } from '../core/SpriteFactory';
import { createDetailedSampanSprite } from './Retro8BitSprites';

const E = {
  'O': '#000000', // Outline
  'B': '#a3e635', // Bamboo Light
  'b': '#ca8a04', // Bamboo Dark
  'W': '#92400e', // Wood Light
  'w': '#78350f', // Wood Dark
  'G': '#4ade80', // Green Light
  'g': '#166534', // Green Dark
  'R': '#ef4444', // Red
  'r': '#991b1b', // Dark Red
  'Y': '#fde047', // Yellow
  'y': '#a16207', // Dark Yellow
  'S': '#9ca3af', // Silver
  's': '#4b5563', // Dark Silver
  'C': '#38bdf8', // Cyan/Water
  'c': '#0284c7', // Dark Water
  'P': '#f9a8d4', // Pink
  'W': '#ffffff', // White
  'x': '#d1d5db', // Off-white
  'D': '#1e1b4b', // Deep Shadow
};

// 1. Bamboo Gate
const bambooGateFrames = [
  [
    ".......OOOOO..OOOOO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObBbO..ObBbO.......",
    ".......ObbbO..ObbbO.......",
    "..OOOOOObbbOOOObbbOOOOOO..",
    ".ObBBbbbbbbbbbbbbbbbbbbO..",
    "..OOOOOObbbOOOObbbOOOOOO..",
    ".......ObbbO..ObbbO.......",
    ".......ObBbO..OOWWO.......",
    ".......ObbbO..OWyWO.......",
    ".......ObbbO..OWWWO.......",
    ".......ObBbO..ObBbO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObBbO..ObBbO.......",
    ".......OOOOO..OOOOO......."
  ],
  [
    ".......OOOOO..OOOOO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObBbO..ObBbO.......",
    ".......ObbbO..ObbbO.......",
    "..OOOOOObbbOOOObbbOOOOOO..",
    ".ObBBbbbbbbbbbbbbbbbbbbO..",
    "..OOOOOObbbOOOObbbOOOOOO..",
    ".......ObbbO..OOWWO.......",
    ".......ObBbO..OWyWO.......",
    ".......ObbbO..OWWWO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObBbO..ObBbO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObbbO..ObbbO.......",
    ".......ObBbO..ObBbO.......",
    ".......OOOOO..OOOOO......."
  ]
];
export function createBambooGateSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(26, 16);
  const ctx = canvas.getContext('2d');
  const current = Math.floor(frame / 6) % 2;
  drawPixelMatrix(ctx, 0, 0, bambooGateFrames[current], E);
  return canvas;
}

// 2. Vintage Bicycle
const bicycleMatrix = [
  "........................................",
  "........OOOO............................",
  ".......OsSSsO..................OOOOO....",
  ".......OOOOOO.................OsSSsO....",
  ".........O...OOOOOOOOOOOOO....OyyyyO....",
  ".........O..OsSssSSSSSSSsSO...OyyyyO....",
  ".........O.OsSOOOOOOOOOOOsSO..OOOOOO....",
  ".........OOsSO..........OsSO....O.......",
  "....OOOOOO.sSO..........OsSO.OOOOOO.....",
  "..OOsssssOO.sSO........OsSO.OOsssssOO...",
  ".OsSOOOOOsSOOsSOOOOOOOOsSO.OsSOOOOOsSO..",
  ".OsO....OsSOO.sSSSSSSSSsO..OsO....OsSO..",
  ".OsO....OsSO...OOOOOOOO....OsO....OsSO..",
  ".OsSOOOOOsSO...............OsSOOOOOsSO..",
  "..OOsssssOO.................OOsssssOO...",
  "....OOOOOO....................OOOOOO...."
];
export function createVintageBicycleSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(40, 16);
  const ctx = canvas.getContext('2d');
  drawPixelMatrix(ctx, 0, 0, bicycleMatrix, E);
  if (frame % 20 < 2) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 10, 2, 2);
    ctx.fillRect(33, 10, 2, 2);
  }
  return canvas;
}

// 3. Gourd Trellis
const trellisFrames = [
  [
    "................................................",
    "...................OOOOOO.......................",
    ".......OOOOOO....OOGGGGGGOO.....................",
    ".....OOGGGGGGOO.OOGggGgGGgOO....OOOOOO..........",
    "....OOGggGgGGgOOOOgGgGgGggGOO.OOGGGGGGOO........",
    "...OOgGgGgGggGOO...OOOOOO....OOGggGgGGgOO.......",
    ".....OOOOOO..........O......OOgGgGgGggGOO.......",
    "......O..O...........O........OOOOOO............",
    "......O..O...........O..........O..O............",
    "......O..O.........OOOO.........O..O............",
    "....OOOO.O........OGGGGO........O.OOOO..........",
    "...OGGGO.O.......OGgGgGO........O.OGGGO.........",
    "...OGgGO.O.......OGgGgGO........O.OGgGO.........",
    "...OGgGO.O........OGGGO.........O.OGgGO.........",
    "....OOO..O.........OOO..........O..OOO..........",
    ".........O......................O..............."
  ],
  [
    "................................................",
    "...................OOOOOO.......................",
    ".......OOOOOO....OOGGGGGGOO.....................",
    ".....OOGGGGGGOO.OOGggGgGGgOO....OOOOOO..........",
    "....OOGggGgGGgOOOOgGgGgGggGOO.OOGGGGGGOO........",
    "...OOgGgGgGggGOO...OOOOOO....OOGggGgGGgOO.......",
    ".....OOOOOO...........O.......OOOOOO............",
    "......O..O............O.........O..O............",
    "......O..O............O.........O..O............",
    "......O..O..........OOOO........O..O............",
    "....OOOO.O.........OGGGGO.......O.OOOO..........",
    "...OGGGO.O........OGgGgGO.......O.OGGGO.........",
    "...OGgGO.O........OGgGgGO.......O.OGgGO.........",
    "...OGgGO.O.........OGGGO........O.OGgGO.........",
    "....OOO..O..........OOO.........O..OOO..........",
    ".........O......................O..............."
  ]
];
export function createGourdTrellisSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(48, 16);
  const ctx = canvas.getContext('2d');
  const current = Math.floor(frame / 5) % 2;
  drawPixelMatrix(ctx, 0, 0, trellisFrames[current], E);
  return canvas;
}

// 4. Clothesline
const clotheslineFrames = [
  [
    "O..............................................O",
    "ObO..........................................ObO",
    "ObbOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOObO",
    "ObO......OOOOO..........OOOOO........OOOOO...ObO",
    "ObO.....ORRRRRO........OxxxxxO......OBBBBO...ObO",
    "ObO....ORrRRRrRO......OxxxxxxO.....OBbBBbBO..ObO",
    "ObO....ORrRRRrRO......OxxxxxxO.....OBbBBbBO..ObO",
    "ObO....ORrOOOOrO......OxxOOOOO.....OBbBBbBO..ObO",
    "ObO.....RO....OR.......xxO...........BO.OB...ObO",
    "ObO..........................................ObO"
  ],
  [
    "O..............................................O",
    "ObO..........................................ObO",
    "ObbOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOObO",
    "ObO......OOOOO..........OOOOO........OOOOO...ObO",
    "ObO.....ORRRRRO........OxxxxxO......OBBBBO...ObO",
    "ObO.....ORrRRRrRO......OxxxxxxO.....OBbBBbBO.ObO",
    "ObO....ORrRRRrRO......OxxxxxxO......OBbBBbBO.ObO",
    "ObO....ORrOOOOrO......OxxOOOOO......OBbBBbBO.ObO",
    "ObO.....RO....OR.......xxO...........BO.OB...ObO",
    "ObO..........................................ObO"
  ]
];
export function createClotheslineSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(48, 10);
  const ctx = canvas.getContext('2d');
  const current = Math.floor(frame / 4) % 2;
  drawPixelMatrix(ctx, 0, 0, clotheslineFrames[current], E);
  return canvas;
}

// 5. Wooden River Dock
const woodenDockMatrix = [
  "................................................",
  "................................................",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWO",
  "OwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwO",
  "OWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWO",
  "OwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  ".......OWwO......................OWwO...........",
  ".......OWwO......................OWwO...........",
  ".......OWwO......................OWwO...........",
  ".......OWwO......................OWwO...........",
  ".......OOOO......................OOOO..........."
];
export function createWoodenDockSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(48, 16);
  const ctx = canvas.getContext('2d');
  drawPixelMatrix(ctx, 0, 0, woodenDockMatrix, E);
  // Water reflections
  ctx.fillStyle = '#0284c7'; // Dark water
  const offset = Math.floor(frame / 3) % 2;
  ctx.fillRect(6 + offset, 13, 6, 1);
  ctx.fillRect(32 - offset, 14, 6, 1);
  return canvas;
}

// 6. Fish Trap Cluster
const fishTrapsMatrix = [
  "................................",
  ".......OOOOO....................",
  "......ObbbbbO...................",
  ".....ObBbBbBbO......OOOOO.......",
  "....ObbbbbbbbbO....ObbbbbO......",
  "...ObBbBbBbBbBbO..ObBbBbBbO.....",
  "..ObbbbbbbbbbbbbOObbbbbbbbbO....",
  ".ObBbBbBbBbBbBbBbObBbBbBbBbBbO..",
  "ObbbbbbbbbbbbbbbbbbbbbbbbbbbbbO.",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO.",
  "................................"
];
export function createFishTrapsSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(32, 12);
  const ctx = canvas.getContext('2d');
  const bobY = Math.round(Math.sin(frame * 0.1) * 1);
  drawPixelMatrix(ctx, 0, Math.max(0, bobY), fishTrapsMatrix, E);
  return canvas;
}

// 7. Floating Fish Raft
const fishRaftMatrix = [
  "................................................................",
  "....OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO....",
  "...OWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWO...",
  "..OWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWO..",
  "..OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO..",
  "...OSsO..................................................OSsO...",
  "...OSsO..................................................OSsO...",
  "...OSsO..................................................OSsO...",
  "...OSsO..OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO..OSsO...",
  "...OOOO..ODDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDO..OOOO...",
  ".........ODcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDDO.........",
  ".........ODcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDcDDO.........",
  ".........OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO........."
];
export function createFishRaftSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(64, 16);
  const ctx = canvas.getContext('2d');
  const bobY = Math.round(Math.sin(frame * 0.1) * 1) + 1;
  drawPixelMatrix(ctx, 0, bobY, fishRaftMatrix, E);
  return canvas;
}

// 8. Floating Market Boat (Composition)
export function createFloatingMarketBoatSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(64, 32); // Slightly taller
  const ctx = canvas.getContext('2d');
  // 1. Draw existing sampan
  const sampan = createDetailedSampanSprite(createBuffer, frame);
  ctx.drawImage(sampan, 0, 6);
  
  // 2. Draw fruits on top (swaying with the boat)
  const bobY = Math.round(Math.sin(frame * 0.15) * 1.5) + 1;
  const fruitsMatrix = [
    "...OOOOO.......OOOOO........OOOOO...",
    "..ORRRRRO.....OYYYYYO......OGGGGGO..",
    ".ORrRrRrRO...OyYyYyYyO....OgGgGgGgO.",
    "ORrRrRrRrRO.OyYyYyYyYyO..OgGgGgGgGgO",
    "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO"
  ];
  drawPixelMatrix(ctx, 14, 10 + bobY, fruitsMatrix, E);
  return canvas;
}

// 9. Market Display Pole (Cây bẹo)
export function createMarketPoleSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(16, 48);
  const ctx = canvas.getContext('2d');
  const swayX = Math.round(Math.sin(frame * 0.05) * 1);
  const poleMatrix = [
    ".......OO.......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".....OOObOOO....",
    "....ORRROYYYO...",
    "....ORRROYYYO...",
    "....OOOOOOOOO...",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......",
    ".......ObO......"
  ];
  drawPixelMatrix(ctx, Math.max(0, swayX), 0, poleMatrix, E);
  return canvas;
}

// 10. Riverside Fruit Stall
const fruitStallMatrix = [
  "........OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO........",
  "......OORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROO......",
  "....OORRRrLrrRRRRRRrLrrRRRRRRrLrrRRRRRRrLrrRRRRRRrLrrROO....",
  "..OORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROO..",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "....OWwO............................................OWwO....",
  "....OWwO........OOOOO.......OOOOO.......OOOOO.......OWwO....",
  "....OWwO.......ORRRRRO.....OYYYYYO.....OGGGGGO......OWwO....",
  "....OWwO......ORrRrRrRO...OyYyYyYyO...OgGgGgGgO.....OWwO....",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "OWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWWwWO",
  "OwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwwWwO",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "....OWwO............................................OWwO....",
  "....OWwO............................................OWwO....",
  "....OOOO............................................OOOO...."
];
export function createFruitStallSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(60, 20);
  const ctx = canvas.getContext('2d');
  drawPixelMatrix(ctx, 0, 0, fruitStallMatrix, E);
  return canvas;
}

// 11. Jumping Fish
const jumpingFishFrames = [
  [ // Underwater
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........................",
    "........OOOOOOOO........",
    ".......OccccccccO.......",
    "........OOOOOOOO........"
  ],
  [ // Jumping up
    "........................",
    "..........OOO...........",
    ".........OSWSO..........",
    "........OSSSWSO.........",
    ".......OSSSSSWSO........",
    "........OSSSWSO.........",
    ".........OSWSO..........",
    "..........OOO...........",
    "........O......O........",
    ".......O.OOOOOO.O......."
  ],
  [ // Falling
    "........................",
    "..........OOO...........",
    ".........OSWSO..........",
    "........OSSSWSO.........",
    ".......OSSSSSWSO........",
    "........OSSSWSO.........",
    ".........OSWSO..........",
    "..........OOO...........",
    "........O......O........",
    ".......O.OOOOOO.O......."
  ],
];
export function createJumpingFishSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(24, 12);
  const ctx = canvas.getContext('2d');
  // Sequence length: 40 frames
  const seq = frame % 40;
  let current = 0;
  if (seq > 10 && seq <= 15) current = 1;
  else if (seq > 15 && seq <= 20) current = 2;
  
  if (current === 0) {
     const waterOffset = Math.round(Math.sin(frame * 0.2) * 1);
     drawPixelMatrix(ctx, 0, waterOffset, jumpingFishFrames[0], E);
  } else {
     drawPixelMatrix(ctx, 0, current === 1 ? -2 : 0, jumpingFishFrames[current], E);
  }
  return canvas;
}

// 12. Childhood Kite
const kiteFrames = [
  [
    "........O.......",
    ".......ORO......",
    "......ORRRO.....",
    ".....ORRRRRO....",
    "....ORRRRRRRO...",
    "...ORRRRRRRRRO..",
    "....ORRRRRRRO...",
    ".....ORRRRRO....",
    "......ORRRO.....",
    ".......ORO......",
    "........O.......",
    "........O.......",
    ".......O........",
    "........O.......",
    ".......O........",
    "........O......."
  ],
  [
    "........O.......",
    ".......ORO......",
    "......ORRRO.....",
    ".....ORRRRRO....",
    "....ORRRRRRRO...",
    "...ORRRRRRRRRO..",
    "....ORRRRRRRO...",
    ".....ORRRRRO....",
    "......ORRRO.....",
    ".......ORO......",
    "........O.......",
    "........O.......",
    ".........O......",
    "........O.......",
    ".........O......",
    "........O......."
  ]
];
export function createChildhoodKiteSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(16, 20);
  const ctx = canvas.getContext('2d');
  const current = Math.floor(frame / 4) % 2;
  const bobY = Math.round(Math.sin(frame * 0.1) * 2);
  drawPixelMatrix(ctx, 0, Math.max(0, bobY), kiteFrames[current], E);
  return canvas;
}

// 13. Dragonfly Cluster
export function createDragonflyClusterSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(32, 32);
  const ctx = canvas.getContext('2d');
  const wingUp = (Math.floor(frame / 2) % 2) === 0;
  
  const drawDragonfly = (x, y, color) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 2, y, 1, 4); // body
    ctx.fillStyle = color;
    if (wingUp) {
      ctx.fillRect(x, y + 1, 2, 1);
      ctx.fillRect(x + 3, y + 1, 2, 1);
    } else {
      ctx.fillRect(x, y + 2, 2, 1);
      ctx.fillRect(x + 3, y + 2, 2, 1);
    }
  };
  
  const sway1 = Math.round(Math.sin(frame * 0.1) * 2);
  const sway2 = Math.round(Math.cos(frame * 0.15) * 2);
  const sway3 = Math.round(Math.sin(frame * 0.08) * 3);
  
  drawDragonfly(5, 5 + sway1, '#ef4444');
  drawDragonfly(20, 10 + sway2, '#fde047');
  drawDragonfly(12, 22 + sway3, '#a3e635');
  
  return canvas;
}

// 14. Firefly Cluster
export function createFireflyClusterSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(48, 48);
  const ctx = canvas.getContext('2d');
  
  const drawFirefly = (x, y, offset) => {
    const intensity = (Math.sin(frame * 0.05 + offset) + 1) / 2; // 0 to 1
    if (intensity > 0.2) {
      ctx.fillStyle = \`rgba(253, 224, 71, \${intensity * 0.5})\`;
      ctx.fillRect(x - 1, y - 1, 3, 3);
      ctx.fillStyle = \`rgba(255, 255, 255, \${intensity})\`;
      ctx.fillRect(x, y, 1, 1);
    }
  };
  
  drawFirefly(10, 10, 0);
  drawFirefly(30, 15, 2);
  drawFirefly(20, 30, 4);
  drawFirefly(40, 25, 1);
  drawFirefly(15, 40, 3);
  
  return canvas;
}

// 15. Contact Wood Sign
const contactSignFrames = [
  [
    "................................",
    ".......O................O.......",
    ".......O................O.......",
    ".......O................O.......",
    "..OOOOOOOOOOOOOOOOOOOOOOOOOOOO..",
    ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
    ".OwWwWwWwWwWwWwWwWwWwWwWwWwWwWO.",
    ".OWWWOOWWOOOOOOWWWOOOWWOOOOOOQO.",
    ".OwWwOOwWOwWwWwOwwOOwWOwWwWwWwO.",
    ".OWWWOOWWOOOOOOWWWOOOWWOOOOOOWO.",
    ".OwWwWwWwWwWwWwWwWwWwWwWwWwWwWO.",
    ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
    "..OOOOOOOOOOOOOOOOOOOOOOOOOOOO.."
  ],
  [
    "................................",
    "........O..............O........",
    ".......O................O.......",
    ".......O................O.......",
    "..OOOOOOOOOOOOOOOOOOOOOOOOOOOO..",
    ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
    ".OwWwWwWwWwWwWwWwWwWwWwWwWwWwWO.",
    ".OWWWOOWWOOOOOOWWWOOOWWOOOOOOWO.",
    ".OwWwOOwWOwWwWwOwwOOwWOwWwWwWwO.",
    ".OWWWOOWWOOOOOOWWWOOOWWOOOOOOWO.",
    ".OwWwWwWwWwWwWwWwWwWwWwWwWwWwWO.",
    ".OWWWWWWWWWWWWWWWWWWWWWWWWWWWWO.",
    "..OOOOOOOOOOOOOOOOOOOOOOOOOOOO.."
  ]
];
export function createContactSignSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(32, 16);
  const ctx = canvas.getContext('2d');
  const current = Math.floor(frame / 10) % 2;
  const swayX = current === 1 ? 1 : 0;
  // Use Q as a substitute for w in the text part to not mess up replace
  const m = contactSignFrames[current].map(row => row.replace(/Q/g, 'W'));
  drawPixelMatrix(ctx, swayX, 0, m, E);
  return canvas;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/components/canvas/sprites/ExpansionRetroSprites.js'), code, 'utf8');
console.log('Successfully wrote ExpansionRetroSprites.js');
