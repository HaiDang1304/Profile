
// Additional colors for Phase 2 & 3
Object.assign(C, {
  // House
  'R': '#b91c1c', 'r': '#7f1d1d', 'L': '#ef4444', // Roof
  'Y': '#fef08a', 'y': '#ca8a04', // Wall
  'W': '#92400e', 'w': '#78350f', // Wood column
  'D': '#1c1917', // Dark shadow
  
  // Monkey Bridge
  'B': '#a3e635', // Light bamboo
  'd': '#ca8a04', // Bridge shadow bamboo (using 'd' from Bamboo Cot)
  
  // Developer
  'S': '#fecaca', // Skin
  'h': '#3b2f2f', // Hair
  'A': '#f3f4f6', // Shirt
  'J': '#1e3a8a', // Jeans
  'P': '#9ca3af', // Laptop
  'p': '#4b5563', // Laptop dark
});

// 6. Traditional House (Nhà Ba Gian)
const houseMatrix = [
  "................................................................",
  ".........................OOOOOOOOOOOOOO.........................",
  ".......................OORRRRRRRRRRRRRROO.......................",
  ".....................OORRRrrrrrrrrrrrrRRROO.....................",
  "...................OORRRRRRRRRRRRRRRRRRRRRROO...................",
  ".................OORRRrrrrrrrrrrrrrrrrrrrrRRROO.................",
  "...............OORRRRRRRRRRRRRRRRRRRRRRRRRRRRRROO...............",
  ".............OORRRrrrrrrrrrrrrrrrrrrrrrrrrrrrrRRROO.............",
  "...........OORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROO...........",
  ".........OORRRrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrRRROO.........",
  ".......OORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROO.......",
  ".....OORRRrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrRRROO.....",
  "...OORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROO...",
  ".OORRRrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrRRROO.",
  "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
  "....OWWO...OYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYOOOOOOOOOOOOOOOOOOOOOOYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYODDDDDDDDDDDDDDDDDDDDOYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYOOOOOYYODDDDDDDDDDDDDDDDDDDDOYYOOOOOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYODDDOYYODDDDDDDDDDDDDDDDDDDDOYYODDDOYYYYYYO...OWWO",
  "....OWWO...OYYOOOOOYYODDDDDDDDDDDDDDDDDDDDOYYOOOOOYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYODDDDDDDDDDDDDDDDDDDDOYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYODDDDDDDDDDDDDDDDDDDDOYYYYYYYYYYYYYO...OWWO",
  "....OWWO...OYYYYYYYYYODDDDDDDDDDDDDDDDDDDDOYYYYYYYYYYYYYO...OWWO",
  "....OOOO...OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO...OOOO",
  "................................................................"
];

export function createDetailedHouseSprite(createBuffer) {
  const canvas = createBuffer(64, 34);
  const ctx = canvas.getContext('2d');
  drawPixelMatrix(ctx, 0, 0, houseMatrix, C);
  return canvas;
}

// 7. Monkey Bridge (Cầu Khỉ)
const monkeyBridgeMatrix = [
  "................................................................",
  "................................................................",
  "................................................................",
  "................................................................",
  "...............OOO......................OOO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "......OOOOOOOOOOBBBBBBBBBBBBBBBBBBBBBBBBBBOOOOOOOOOO............",
  "......OddddddddddddddddddddddddddddddddddddddddddddO............",
  "......OOOOOOOOOOBOOOOOOOOOOOOOOOOOOOOOOOOOBOOOOOOOOO............",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...............OBO......................OBO.....................",
  "...OOOOOOOOOOOOOBBBBBBBBBBBBBBBBBBBBBBBBBBOOOOOOOOOOOOOO........",
  "...OdddddddddddddddddddddddddddddddddddddddddddddddddddO........",
  "...OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO........",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OBO...OBO......................OBO...OBO...............",
  ".........OOO...OOO......................OOO...OOO...............",
  "................................................................",
  "................................................................"
];

export function createDetailedMonkeyBridgeSprite(createBuffer) {
  const canvas = createBuffer(64, 32);
  const ctx = canvas.getContext('2d');
  drawPixelMatrix(ctx, 0, 0, monkeyBridgeMatrix, C);
  return canvas;
}

// 8. Developer Hải Đăng (Animated Typing)
const devFrames = [
  [
    "...........OOOOO................",
    "..........OhhhhhO...............",
    ".........OhhhhhhhO..............",
    ".........OSOSSSSsO..............",
    ".........OSSSSSSsO..............",
    "..........OSSSSsO...............",
    ".........OOAAAAAAOO.............",
    "........OAAAAAAAAAAO............",
    ".......OAAAOOAAOOAAAO...........",
    ".......OSSO..OAO..OSSO..........",
    ".......OSSO..OAO..OSSO..........",
    ".......OOOO..OAO..OOOO..........",
    ".............OAO................",
    ".............OAO................",
    "..........OOOJJJOOO.............",
    ".........OJJJJJJJJJO............",
    ".........OJJJJJJJJJO............",
    "..........OPPPPPPPPO............",
    ".........OPOOPPPPOOPO...........",
    ".........OPpOPPPPOpPO...........",
    ".........OPpOPPPPOpPO...........",
    ".........OPOOPPPPOOPO...........",
    ".........OPPPPPPPPPPO...........",
    ".........OppppppppppO...........",
    "..........OOOOOOOOOO............"
  ],
  [
    "...........OOOOO................",
    "..........OhhhhhO...............",
    ".........OhhhhhhhO..............",
    ".........OSOSSSSsO..............",
    ".........OSSSSSSsO..............",
    "..........OSSSSsO...............",
    ".........OOAAAAAAOO.............",
    "........OAAAAAAAAAAO............",
    ".......OAAAOOAAOOAAAO...........",
    ".......OSSO..OAO..OSSO..........",
    ".......OSSO..OAO..OSSO..........",
    ".............OAO..OSSO..........",
    ".............OAO..OOOO..........",
    ".......OOOO..OAO................",
    "..........OOOJJJOOO.............",
    ".........OJJJJJJJJJO............",
    ".........OJJJJJJJJJO............",
    "..........OPPPPPPPPO............",
    ".........OPOOPPPPOOPO...........",
    ".........OPpOPPPPOpPO...........",
    ".........OPpOPPPPOpPO...........",
    ".........OPOOPPPPOOPO...........",
    ".........OPPPPPPPPPPO...........",
    ".........OppppppppppO...........",
    "..........OOOOOOOOOO............"
  ]
];

export function createDetailedDevSprite(createBuffer, frame = 0) {
  const canvas = createBuffer(32, 25);
  const ctx = canvas.getContext('2d');
  const currentFrame = Math.floor(frame / 2) % 2; // Fast typing
  drawPixelMatrix(ctx, 0, 0, devFrames[currentFrame], C);
  return canvas;
}
