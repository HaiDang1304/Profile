import { viewportTransform } from '../core/ViewportTransform';

const WIDTH = 384;
const HEIGHT = 216;
const TRANSITIONS = [0.14, 0.32, 0.5, 0.68, 0.86];
const SCENE_IDS = ['hero', 'about', 'projects', 'technology', 'playground', 'contact'];

const PALETTES = {
  hero: {
    sky: ['#5b7bb6', '#d59c91', '#f6c68d', '#ffe2a2'],
    sun: '#ffe39a', haze: '#dca477', far: '#496d65', mid: '#285844', near: '#173b32',
    water: ['#527f8d', '#396b78', '#244e61'], bank: '#285f39', earth: '#6f4227', light: '#ffe7aa',
  },
  about: {
    sky: ['#5d9ebe', '#9bc7c3', '#d4d8a5', '#f4d398'],
    sun: '#fff0a8', haze: '#b5c69a', far: '#47745a', mid: '#2f6942', near: '#1c4d34',
    water: ['#68a6a0', '#438985', '#2d6b70'], bank: '#4a793d', earth: '#7a4b29', light: '#fff2bc',
  },
  projects: {
    sky: ['#4798bf', '#7fc0d1', '#b8d8ca', '#f4dc9e'],
    sun: '#fff4bd', haze: '#9fbfa0', far: '#38715e', mid: '#246047', near: '#164537',
    water: ['#4d9eaa', '#2f7e91', '#215f78'], bank: '#347343', earth: '#784828', light: '#fff5c7',
  },
  technology: {
    sky: ['#477ba0', '#a8867f', '#d19b72', '#f0c17e'],
    sun: '#ffd87d', haze: '#8b8b70', far: '#446552', mid: '#31573d', near: '#213c32',
    water: ['#557d82', '#3c6872', '#2c5061'], bank: '#3f6338', earth: '#6b4328', light: '#ffd887',
  },
  playground: {
    sky: ['#292f69', '#755075', '#cf6f68', '#f3a45e'],
    sun: '#ffc36a', haze: '#90655f', far: '#36464a', mid: '#263d36', near: '#172d29',
    water: ['#4a6177', '#3b506b', '#293d5d'], bank: '#3c5632', earth: '#66402b', light: '#ffc667',
  },
  contact: {
    sky: ['#07132d', '#10284a', '#29425d', '#40576a'],
    sun: '#f7e6aa', haze: '#263f50', far: '#193a3b', mid: '#12312f', near: '#0b2424',
    water: ['#1e4658', '#173b50', '#102d43'], bank: '#244536', earth: '#49342a', light: '#ffd16b',
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(value) {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function rect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
  for (let index = 1; index < points.length; index += 1) {
    ctx.lineTo(Math.round(points[index][0]), Math.round(points[index][1]));
  }
  ctx.closePath();
  ctx.fill();
}

function pixelDisc(ctx, cx, cy, radius, color) {
  for (let y = -radius; y <= radius; y += 2) {
    const half = Math.floor(Math.sqrt(Math.max(0, radius * radius - y * y)));
    rect(ctx, cx - half, cy + y, half * 2 + 1, 2, color);
  }
}

function paletteBand(ctx, colors) {
  const bandHeight = 31;
  for (let index = 0; index < colors.length; index += 1) {
    rect(ctx, 0, index * bandHeight, WIDTH, bandHeight + 1, colors[index]);
  }
  for (let y = 27; y < 116; y += 7) {
    const tone = colors[Math.min(colors.length - 1, Math.floor(y / bandHeight) + 1)];
    for (let x = ((y * 13) % 17); x < WIDTH; x += 23) rect(ctx, x, y, 2 + (x % 3), 1, tone);
  }
}

function drawStars(ctx, time, energy) {
  const count = 52 + Math.round(energy * 18);
  for (let index = 0; index < count; index += 1) {
    const x = (index * 71 + 13) % WIDTH;
    const y = 7 + (index * 37) % 88;
    const twinkle = Math.sin(time * (1.8 + index % 4) + index) > 0.42;
    rect(ctx, x, y, twinkle ? 2 : 1, 1, index % 7 === 0 ? '#b9d9ee' : '#f9eac0');
    if (twinkle && index % 9 === 0) rect(ctx, x, y - 1, 1, 3, '#f9eac0');
  }
}

function drawCelestial(ctx, id, palette, time, energy) {
  const night = id === 'contact';
  const x = night ? 83 : id === 'playground' ? 302 : 296;
  const y = night ? 38 : id === 'hero' ? 46 : 52;
  const radius = night ? 13 : 12;
  if (night) drawStars(ctx, time, energy);
  pixelDisc(ctx, x, y + Math.sin(time * 0.12) * (night ? 0 : 1), radius + 3, `${palette.sun}22`);
  pixelDisc(ctx, x, y, radius, palette.sun);
  if (night) {
    pixelDisc(ctx, x + 5, y - 4, radius - 2, '#10284a');
    rect(ctx, x - 11, y + 11, 11, 2, '#d6c88f');
  } else {
    rect(ctx, x - 8, y - 5, 5, 2, '#fff1bd');
    rect(ctx, x + 2, y + 3, 7, 2, '#e9b866');
  }
}

function drawCloud(ctx, x, y, scale, light, shade) {
  rect(ctx, x + 5 * scale, y + 4 * scale, 31 * scale, 6 * scale, light);
  rect(ctx, x + 11 * scale, y, 18 * scale, 7 * scale, light);
  rect(ctx, x + 18 * scale, y - 4 * scale, 10 * scale, 7 * scale, light);
  rect(ctx, x, y + 7 * scale, 42 * scale, 5 * scale, light);
  rect(ctx, x + 8 * scale, y + 12 * scale, 27 * scale, 2 * scale, shade);
  rect(ctx, x + 14 * scale, y + 14 * scale, 15 * scale, 1 * scale, shade);
}

function drawClouds(ctx, id, time, pointerX, reducedMotion) {
  const night = id === 'contact';
  const sunset = id === 'playground' || id === 'technology';
  const light = night ? '#314967' : sunset ? '#e6a18b' : '#f5e8d0';
  const shade = night ? '#213956' : sunset ? '#b76e70' : '#c6c5b2';
  for (let index = 0; index < 5; index += 1) {
    const speed = reducedMotion ? 0 : 2.4 + index * 0.7;
    const lane = WIDTH + 70;
    const x = ((index * 97 + time * speed) % lane) - 55 + pointerX * (1 + index * 0.3);
    const y = 17 + index * 15 + Math.sin(time * 0.35 + index) * 2;
    drawCloud(ctx, x, y, 0.65 + index * 0.07, light, shade);
  }
}

function drawRidges(ctx, palette, time, pointerX) {
  const farShift = Math.round(pointerX * 2);
  poly(ctx, [[-8, 110], [24 + farShift, 86], [44 + farShift, 100], [73 + farShift, 78], [106 + farShift, 105], [141 + farShift, 85], [178 + farShift, 106], [217 + farShift, 76], [250 + farShift, 100], [292 + farShift, 82], [326 + farShift, 102], [392, 83], [392, 128], [-8, 128]], palette.haze);
  poly(ctx, [[-8, 121], [19, 105], [42, 112], [67, 96], [90, 115], [119, 99], [147, 118], [177, 94], [204, 115], [235, 97], [265, 114], [301, 96], [327, 113], [356, 98], [392, 112], [392, 132], [-8, 132]], palette.far);
  for (let x = -10; x < WIDTH + 18; x += 11) {
    const sway = Math.round(Math.sin(time * 0.6 + x) * 1);
    const height = 10 + ((x * 7) % 9 + 9) % 9;
    rect(ctx, x + sway, 120 - height, 2, height, palette.mid);
    poly(ctx, [[x - 5 + sway, 116 - height], [x + 1 + sway, 106 - height], [x + 7 + sway, 116 - height]], palette.mid);
  }
}

function drawWater(ctx, palette, time, energy, id) {
  rect(ctx, 0, 122, WIDTH, 94, palette.water[0]);
  rect(ctx, 0, 151, WIDTH, 65, palette.water[1]);
  rect(ctx, 0, 188, WIDTH, 28, palette.water[2]);
  const speed = id === 'projects' ? 7 : 4;
  for (let row = 0; row < 13; row += 1) {
    const y = 127 + row * 7;
    const offset = Math.round((time * speed * (row % 2 ? -1 : 1) + row * 29) % 46);
    const alpha = 0.17 + energy * 0.08;
    for (let x = -30 + offset; x < WIDTH + 30; x += 54 + row % 3 * 8) {
      rect(ctx, x, y, 13 + row % 4 * 3, row % 5 === 0 ? 2 : 1, `rgba(244,238,184,${alpha})`);
      rect(ctx, x + 6, y + 3, 8 + row % 3 * 2, 1, 'rgba(135,210,213,.14)');
    }
  }
}

function grassTuft(ctx, x, y, color, time, phase = 0) {
  const sway = Math.round(Math.sin(time * 1.7 + phase) * 2);
  rect(ctx, x, y - 6, 1, 7, color);
  rect(ctx, x + sway, y - 8, 1, 4, color);
  rect(ctx, x - 3 + sway, y - 5, 3, 1, color);
  rect(ctx, x + 1 + sway, y - 4, 4, 1, color);
}

function drawBank(ctx, x, width, top, palette, time) {
  poly(ctx, [[x, top], [x + width, top - 3], [x + width + 8, HEIGHT], [x - 8, HEIGHT]], palette.earth);
  rect(ctx, x, top - 4, width, 6, palette.bank);
  rect(ctx, x + 8, top + 6, width - 16, 2, '#8d5a30');
  rect(ctx, x + 3, top + 16, width - 9, 2, '#4f3527');
  for (let tx = x + 5; tx < x + width - 3; tx += 12) grassTuft(ctx, tx, top - 3, '#5b913f', time, tx);
}

function drawPalm(ctx, x, ground, scale, time, palette) {
  const sway = Math.round(Math.sin(time * 0.9 + x * 0.1) * 2);
  const height = 45 * scale;
  poly(ctx, [[x - 3, ground], [x + 2, ground], [x + sway + 1, ground - height], [x + sway - 3, ground - height]], '#5a3522');
  rect(ctx, x, ground - height * 0.75, 2, 9 * scale, '#9a6031');
  for (let index = 0; index < 7; index += 1) {
    const side = index % 2 ? 1 : -1;
    const length = (16 + index % 3 * 4) * scale;
    const leafY = ground - height - 4 + (index % 3) * 3;
    poly(ctx, [[x + sway, ground - height], [x + sway + side * length, leafY], [x + sway + side * (length - 3), leafY + 3], [x + sway + side * 3, ground - height + 3]], index < 3 ? palette.mid : '#277044');
    rect(ctx, x + sway + side * Math.round(length * 0.45), leafY + 2, side * Math.round(length * 0.34), 1, '#69a84c');
  }
  rect(ctx, x + sway - 3, ground - height + 2, 3, 3, '#7e4a24');
  rect(ctx, x + sway + 2, ground - height + 3, 3, 3, '#a96b31');
}

function drawBamboo(ctx, x, ground, time, palette, height = 55) {
  for (let index = 0; index < 5; index += 1) {
    const stemX = x + index * 5;
    const stemHeight = height - index * 4 + (index % 2) * 8;
    const sway = Math.round(Math.sin(time * 1.1 + index) * 2);
    rect(ctx, stemX, ground - stemHeight, 2, stemHeight, '#527c3e');
    for (let node = 9; node < stemHeight; node += 11) rect(ctx, stemX - 1, ground - node, 4, 1, '#91a851');
    rect(ctx, stemX + sway - 5, ground - stemHeight + 7, 6, 2, palette.mid);
    rect(ctx, stemX + sway + 2, ground - stemHeight + 14, 7, 2, '#3f7741');
  }
}

function drawHouse(ctx, x, ground, scale, palette, night, time) {
  const width = 76 * scale;
  const height = 38 * scale;
  rect(ctx, x + 5 * scale, ground - height, width - 10 * scale, height, '#7d4728');
  rect(ctx, x + 9 * scale, ground - height + 5, width - 18 * scale, 4, '#ad6936');
  poly(ctx, [[x - 8 * scale, ground - height], [x + 15 * scale, ground - height - 19 * scale], [x + width - 13 * scale, ground - height - 19 * scale], [x + width + 8 * scale, ground - height]], '#3e2a22');
  poly(ctx, [[x - 4 * scale, ground - height - 2], [x + 17 * scale, ground - height - 16 * scale], [x + width - 16 * scale, ground - height - 16 * scale], [x + width + 4 * scale, ground - height - 2]], '#9b5a2d');
  for (let tile = 0; tile < 7; tile += 1) rect(ctx, x + 8 * scale + tile * 9 * scale, ground - height - 12 * scale + (tile % 2), 7 * scale, 2, '#c47a39');
  rect(ctx, x + 12 * scale, ground - 27 * scale, 16 * scale, 27 * scale, '#462b22');
  rect(ctx, x + 16 * scale, ground - 22 * scale, 2, 2, '#d5a95d');
  const glow = 0.75 + Math.sin(time * 5) * 0.12;
  rect(ctx, x + 41 * scale, ground - 27 * scale, 19 * scale, 15 * scale, '#342c29');
  rect(ctx, x + 44 * scale, ground - 24 * scale, 13 * scale, 9 * scale, night ? `rgba(255,210,105,${glow})` : '#9ad3c6');
  rect(ctx, x + 50 * scale, ground - 25 * scale, 1, 11 * scale, '#4d3526');
  rect(ctx, x + 43 * scale, ground - 20 * scale, 16 * scale, 1, '#4d3526');
  for (let post = 8; post < width - 5; post += 18) rect(ctx, x + post * scale, ground, 3 * scale, 18 * scale, '#40291f');
  rect(ctx, x, ground + 15 * scale, width, 3 * scale, '#2f231f');
  rect(ctx, x + width - 6 * scale, ground - height - 28 * scale, 4 * scale, 17 * scale, '#513126');
  if (night) {
    for (let index = 0; index < 5; index += 1) {
      const life = (time * 0.13 + index * 0.21) % 1;
      rect(ctx, x + width - 4 + Math.sin(index * 2.3) * 5, ground - height - 30 - life * 18, 3, 3, `rgba(185,190,196,${0.34 - life * 0.2})`);
    }
  }
}

function drawLotus(ctx, x, y, time, phase) {
  const bob = Math.round(Math.sin(time * 1.4 + phase) * 1.5);
  rect(ctx, x - 6, y + bob, 13, 2, '#2d7257');
  rect(ctx, x, y - 8 + bob, 1, 9, '#4c9364');
  rect(ctx, x - 5, y - 9 + bob, 5, 3, '#e35f92');
  rect(ctx, x, y - 11 + bob, 4, 5, '#ff9bc0');
  rect(ctx, x + 4, y - 9 + bob, 4, 3, '#d84d83');
  rect(ctx, x + 1, y - 8 + bob, 2, 2, '#ffe58c');
}

function drawBridge(ctx, x, y, width) {
  for (let index = 0; index < 9; index += 1) {
    const stepY = Math.abs(4 - index) * 2;
    rect(ctx, x + index * (width / 9), y - stepY, width / 9 - 1, 4, '#b27039');
    rect(ctx, x + index * (width / 9) + 2, y + 3 - stepY, 2, 15 + stepY, '#503021');
  }
  rect(ctx, x - 2, y - 14, 3, 24, '#43291f');
  rect(ctx, x + width, y - 14, 3, 24, '#43291f');
  rect(ctx, x, y - 12, width, 2, '#80502c');
}

function drawBoat(ctx, x, y, time, scale = 1) {
  const bob = Math.round(Math.sin(time * 1.8 + x) * 1.4);
  poly(ctx, [[x, y + bob], [x + 55 * scale, y + bob], [x + 47 * scale, y + 10 * scale + bob], [x + 8 * scale, y + 10 * scale + bob]], '#39271f');
  poly(ctx, [[x + 5 * scale, y + 2 + bob], [x + 50 * scale, y + 2 + bob], [x + 44 * scale, y + 7 * scale + bob], [x + 10 * scale, y + 7 * scale + bob]], '#9a5b2d');
  rect(ctx, x + 25 * scale, y - 19 * scale + bob, 2 * scale, 20 * scale, '#4a3022');
  poly(ctx, [[x + 27 * scale, y - 18 * scale + bob], [x + 45 * scale, y - 11 * scale + bob], [x + 27 * scale, y - 3 * scale + bob]], '#e6b34b');
  rect(ctx, x + 9 * scale, y + 12 * scale + bob, 39 * scale, 1, 'rgba(225,244,224,.38)');
}

function drawLantern(ctx, x, y, time, index) {
  const bob = Math.round(Math.sin(time * 1.7 + index) * 2);
  const colors = ['#f15b4c', '#f3b743', '#c66ee2', '#ed8242'];
  rect(ctx, x, y - 8 + bob, 1, 9, '#513128');
  rect(ctx, x - 4, y + bob, 9, 2, '#6e3726');
  rect(ctx, x - 5, y + 2 + bob, 11, 9, colors[index % colors.length]);
  rect(ctx, x - 2, y + 4 + bob, 5, 5, '#ffe19a');
  rect(ctx, x - 3, y + 11 + bob, 7, 2, '#6e3726');
  rect(ctx, x, y + 13 + bob, 1, 4, '#f0b34b');
}

function drawHero(ctx, palette, time, energy) {
  drawBank(ctx, 206, 178, 166, palette, time);
  drawHouse(ctx, 263, 150, 0.9, palette, false, time);
  drawPalm(ctx, 226, 163, 1.15, time, palette);
  drawBamboo(ctx, 359, 164, time, palette, 47);
  drawBridge(ctx, 205, 178, 57);
  for (let index = 0; index < 8 + energy * 5; index += 1) drawLotus(ctx, 218 + (index * 23) % 154, 191 + (index % 3) * 8, time, index);
}

function drawAbout(ctx, palette, time) {
  drawBank(ctx, 0, 184, 163, palette, time);
  drawBridge(ctx, 52, 151, 104);
  drawPalm(ctx, 23, 160, 1.08, time, palette);
  drawPalm(ctx, 172, 161, 0.85, time + 1, palette);
  drawBamboo(ctx, 2, 161, time, palette, 51);
  for (let index = 0; index < 9; index += 1) {
    const x = 17 + index * 19;
    const sway = Math.round(Math.sin(time * 1.3 + index) * 2);
    rect(ctx, x, 128, 2, 32, '#5f4826');
    rect(ctx, x - 7 + sway, 126 + index % 2 * 3, 16, 4, index % 3 ? '#397542' : '#72a444');
    rect(ctx, x + sway, 123, 3, 3, '#e4b344');
  }
}

function drawProjects(ctx, palette, time) {
  drawBank(ctx, 208, 176, 176, palette, time);
  rect(ctx, 236, 138, 3, 39, '#533322');
  rect(ctx, 285, 140, 3, 37, '#533322');
  rect(ctx, 231, 139, 62, 5, '#a76631');
  rect(ctx, 239, 147, 49, 3, '#6a3e25');
  for (let index = 0; index < 5; index += 1) {
    rect(ctx, 244 + index * 10, 127, 2, 12, '#563222');
    const flap = Math.round(Math.sin(time * 3 + index) * 2);
    poly(ctx, [[246 + index * 10, 128], [254 + index * 10 + flap, 131], [246 + index * 10, 135]], ['#e25b42', '#f1b642', '#4b9fb4'][index % 3]);
  }
  drawBoat(ctx, 250, 173, time, 1.18);
  drawBoat(ctx, 182, 198, time + 1.7, 0.73);
  drawPalm(ctx, 361, 171, 1.0, time, palette);
}

function drawTechnology(ctx, palette, time, energy) {
  drawBank(ctx, 0, 188, 174, palette, time);
  drawHouse(ctx, 18, 157, 1.05, palette, true, time);
  rect(ctx, 102, 132, 48, 32, '#412f2a');
  rect(ctx, 107, 137, 38, 22, '#132c3c');
  const scan = Math.floor(time * 8) % 17;
  rect(ctx, 110, 140 + scan, 27, 1, '#5de4ce');
  rect(ctx, 111, 144, 14, 2, '#e9bc52');
  rect(ctx, 118, 149, 21, 2, '#68aee5');
  rect(ctx, 121, 164, 8, 8, '#554033');
  const spin = time * (2 + energy * 5);
  ctx.save();
  ctx.translate(162, 144);
  ctx.rotate(spin);
  for (let index = 0; index < 4; index += 1) {
    ctx.rotate(Math.PI / 2);
    rect(ctx, 0, -2, 16, 4, '#79b9a8');
    rect(ctx, 12, -3, 5, 2, '#e8c671');
  }
  rect(ctx, -3, -3, 6, 6, '#d59e45');
  ctx.restore();
  drawBamboo(ctx, 1, 172, time, palette, 44);
}

function drawPlayground(ctx, palette, time, energy) {
  drawBank(ctx, 207, 178, 177, palette, time);
  drawHouse(ctx, 298, 161, 0.72, palette, true, time);
  rect(ctx, 214, 118, 164, 1, '#49302a');
  for (let index = 0; index < 7; index += 1) drawLantern(ctx, 224 + index * 24, 119, time * (1 + energy * 0.2), index);
  const kiteX = 260 + Math.sin(time * 0.8) * 13;
  const kiteY = 56 + Math.cos(time * 1.1) * 7;
  poly(ctx, [[kiteX, kiteY - 9], [kiteX + 9, kiteY], [kiteX, kiteY + 9], [kiteX - 9, kiteY]], '#ef6455');
  poly(ctx, [[kiteX, kiteY - 9], [kiteX + 9, kiteY], [kiteX, kiteY]], '#f6c44f');
  for (let index = 0; index < 9; index += 1) rect(ctx, kiteX - index * 7, kiteY + 9 + index * 5 + Math.sin(time + index) * 2, 6, 1, '#5b3428');
  drawPalm(ctx, 220, 176, 1.0, time, palette);
}

function drawContact(ctx, palette, time, energy) {
  drawBank(ctx, 0, 185, 174, palette, time);
  drawHouse(ctx, 13, 155, 0.96, palette, true, time);
  drawPalm(ctx, 169, 171, 0.94, time, palette);
  const flame = 6 + Math.round((Math.sin(time * 11) + 1) * 2 + energy * 4);
  rect(ctx, 118, 156, 28, 5, '#392820');
  rect(ctx, 122, 161, 20, 12, '#7b3826');
  rect(ctx, 127, 155 - flame, 10, flame + 4, '#ef5d31');
  rect(ctx, 130, 157 - flame, 5, flame, '#ffd15b');
  rect(ctx, 132, 158 - flame, 2, Math.max(2, flame - 4), '#fff2ae');
  for (let index = 0; index < 8 + energy * 12; index += 1) {
    const life = (time * (0.16 + index % 3 * 0.03) + index * 0.17) % 1;
    rect(ctx, 132 + Math.sin(index * 4.1) * 30, 143 - life * 64, 2, 2, index % 2 ? '#ffe56c' : '#9cf07c');
  }
}

const SCENE_DRAWERS = { hero: drawHero, about: drawAbout, projects: drawProjects, technology: drawTechnology, playground: drawPlayground, contact: drawContact };

function getBlend(progress) {
  for (let index = 0; index < TRANSITIONS.length; index += 1) {
    const point = TRANSITIONS[index];
    if (progress < point - 0.025) return [{ index, alpha: 1 }];
    if (progress <= point + 0.025) {
      const mix = smoothstep((progress - point + 0.025) / 0.05);
      return [{ index, alpha: 1 - mix }, { index: index + 1, alpha: mix }];
    }
  }
  return [{ index: SCENE_IDS.length - 1, alpha: 1 }];
}

function drawScene(ctx, id, time, pointerX, energy, reducedMotion) {
  const palette = PALETTES[id];
  paletteBand(ctx, palette.sky);
  drawCelestial(ctx, id, palette, time, energy);
  drawClouds(ctx, id, time, pointerX, reducedMotion);
  drawRidges(ctx, palette, time, pointerX);
  drawWater(ctx, palette, time, energy, id);
  SCENE_DRAWERS[id](ctx, palette, time, energy);
  for (let index = 0; index < 34; index += 1) {
    const x = (index * 47 + 11) % WIDTH;
    const y = 124 + (index * 29) % 88;
    rect(ctx, x, y, 1, 1, index % 2 ? 'rgba(255,255,220,.18)' : 'rgba(8,30,38,.18)');
  }
}

export class ProceduralBackdropRenderer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.pointer = { x: 0, y: 0 };
    this.pointerTarget = { x: 0, y: 0 };
    this.interactions = new Map();
  }

  setPointer(x, y) {
    this.pointerTarget.x = clamp(x, -1, 1);
    this.pointerTarget.y = clamp(y, -1, 1);
  }

  trigger(sceneId) {
    this.interactions.set(sceneId, performance.now() * 0.001);
  }

  getEnergy(sceneId, time, reducedMotion) {
    const started = this.interactions.get(sceneId);
    if (started === undefined) return 0;
    const duration = reducedMotion ? 0.5 : 3;
    const remaining = 1 - (time - started) / duration;
    if (remaining <= 0) {
      this.interactions.delete(sceneId);
      return 0;
    }
    return smoothstep(remaining);
  }

  render(ctx, progress, time, reducedMotion) {
    viewportTransform.applyScreenSpace(ctx);
    const viewport = viewportTransform.getViewportSize();
    const smoothing = reducedMotion ? 1 : 0.08;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * smoothing;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * smoothing;
    const motionTime = reducedMotion ? 0 : time;
    const blend = getBlend(progress);

    this.ctx.imageSmoothingEnabled = false;
    const base = blend[0];
    const baseId = SCENE_IDS[base.index];
    drawScene(this.ctx, baseId, motionTime, this.pointer.x, this.getEnergy(baseId, time, reducedMotion), reducedMotion);
    if (blend.length > 1) {
      const overlay = blend[1];
      const overlayId = SCENE_IDS[overlay.index];
      this.ctx.save();
      this.ctx.globalAlpha = overlay.alpha;
      drawScene(this.ctx, overlayId, motionTime, this.pointer.x, this.getEnergy(overlayId, time, reducedMotion), reducedMotion);
      this.ctx.restore();
    }

    const scale = Math.max(viewport.width / WIDTH, viewport.height / HEIGHT);
    const drawWidth = WIDTH * scale;
    const drawHeight = HEIGHT * scale;
    const offsetX = (viewport.width - drawWidth) * 0.5 - this.pointer.x * (reducedMotion ? 0 : 3);
    const offsetY = (viewport.height - drawHeight) * 0.5 - this.pointer.y * (reducedMotion ? 0 : 2);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.canvas, Math.floor(offsetX), Math.floor(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));

    const shade = ctx.createLinearGradient(0, 0, viewport.width, 0);
    shade.addColorStop(0, 'rgba(2,8,14,.2)');
    shade.addColorStop(0.2, 'rgba(2,8,14,0)');
    shade.addColorStop(0.8, 'rgba(2,8,14,0)');
    shade.addColorStop(1, 'rgba(2,8,14,.2)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
    return true;
  }
}
