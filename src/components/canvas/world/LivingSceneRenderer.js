import { viewportTransform } from '../core/ViewportTransform';
import { getActiveSceneId } from '../data/sceneLayout';

const SCENE_MOTION = {
  hero: {
    artSide: 'right',
    groundY: 0.78,
    mobileGroundY: 0.5,
    route: [0.52, 0.9],
    shirt: '#1f7a67',
    trousers: '#20324b',
    accent: '#f6bd43',
    cloud: ['rgba(255,238,215,.36)', 'rgba(210,177,196,.22)'],
    foliage: ['rgba(21,102,58,.48)', 'rgba(91,151,71,.38)'],
    canopy: [0.88, 0.24],
    role: 'traveler',
  },
  about: {
    artSide: 'left',
    groundY: 0.74,
    mobileGroundY: 0.34,
    route: [0.08, 0.46],
    shirt: '#356c8d',
    trousers: '#3e352b',
    accent: '#8fd36f',
    cloud: ['rgba(255,255,240,.34)', 'rgba(169,215,226,.2)'],
    foliage: ['rgba(30,126,59,.46)', 'rgba(135,185,70,.4)'],
    canopy: [0.14, 0.22],
    role: 'farmer',
  },
  projects: {
    artSide: 'right',
    groundY: 0.72,
    mobileGroundY: 0.29,
    route: [0.54, 0.91],
    shirt: '#d96d38',
    trousers: '#24364d',
    accent: '#ffd35c',
    cloud: ['rgba(255,255,248,.3)', 'rgba(142,204,223,.18)'],
    foliage: ['rgba(20,101,65,.43)', 'rgba(91,158,76,.34)'],
    canopy: [0.9, 0.26],
    role: 'porter',
  },
  technology: {
    artSide: 'left',
    groundY: 0.73,
    mobileGroundY: 0.28,
    route: [0.08, 0.47],
    shirt: '#208e87',
    trousers: '#28364a',
    accent: '#69e0d0',
    cloud: ['rgba(255,231,184,.25)', 'rgba(155,120,91,.16)'],
    foliage: ['rgba(37,89,54,.38)', 'rgba(135,133,69,.3)'],
    canopy: null,
    role: 'maker',
  },
  playground: {
    artSide: 'right',
    groundY: 0.73,
    mobileGroundY: 0.3,
    route: [0.53, 0.91],
    shirt: '#e95462',
    trousers: '#304b69',
    accent: '#73ddd2',
    cloud: ['rgba(255,147,113,.25)', 'rgba(117,64,119,.2)'],
    foliage: ['rgba(35,69,43,.5)', 'rgba(138,120,52,.34)'],
    canopy: [0.82, 0.18],
    role: 'child',
  },
  contact: {
    artSide: 'left',
    groundY: 0.72,
    mobileGroundY: 0.27,
    route: [0.08, 0.45],
    shirt: '#98643d',
    trousers: '#263852',
    accent: '#ffd16c',
    cloud: ['rgba(73,103,158,.18)', 'rgba(15,31,66,.2)'],
    foliage: ['rgba(16,61,57,.45)', 'rgba(51,101,77,.32)'],
    canopy: [0.46, 0.12],
    role: 'neighbor',
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(width)), Math.max(1, Math.round(height)));
}

function routeState(time, speed, seed = 0) {
  const raw = ((time * speed + seed) % 2 + 2) % 2;
  return { position: raw <= 1 ? raw : 2 - raw, direction: raw <= 1 ? 1 : -1 };
}

function drawPixelCloud(ctx, x, y, scale, tones) {
  const [light, shadow] = tones;
  rect(ctx, x + 8 * scale, y + 7 * scale, 42 * scale, 8 * scale, light);
  rect(ctx, x + 15 * scale, y + 2 * scale, 28 * scale, 9 * scale, light);
  rect(ctx, x + 25 * scale, y - 3 * scale, 13 * scale, 8 * scale, light);
  rect(ctx, x + 2 * scale, y + 10 * scale, 13 * scale, 5 * scale, light);
  rect(ctx, x + 48 * scale, y + 11 * scale, 10 * scale, 4 * scale, light);
  rect(ctx, x + 13 * scale, y + 15 * scale, 35 * scale, 3 * scale, shadow);
  rect(ctx, x + 21 * scale, y + 18 * scale, 20 * scale, 2 * scale, shadow);
}

function drawCloudLayer(ctx, viewport, scene, time, reducedMotion, pointerX) {
  const speed = reducedMotion ? 0 : 1;
  for (let index = 0; index < 4; index += 1) {
    const direction = index % 2 ? -1 : 1;
    const laneWidth = viewport.width + 260;
    const travel = (time * (5 + index * 1.8) * speed + index * 241) % laneWidth;
    const x = direction > 0 ? travel - 150 : viewport.width + 80 - travel;
    const y = viewport.height * (0.1 + index * 0.075) + Math.sin(time * 0.25 + index) * 5;
    const scale = clamp(viewport.width / 900, 0.68, 1.35) * (0.82 + index * 0.1);
    drawPixelCloud(ctx, x + pointerX * (3 + index), y, scale, scene.cloud);
  }
}

function drawCanopySway(ctx, viewport, scene, time, reducedMotion, pointerX) {
  if (!scene.canopy || (viewport.width < 600 && scene.role === 'neighbor')) return;
  const onRight = scene.artSide === 'right';
  const originX = viewport.width * scene.canopy[0];
  const originY = viewport.height * scene.canopy[1];
  const scale = clamp(viewport.width / 1450, 0.52, 1);
  for (let index = 0; index < 16; index += 1) {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const spreadX = (column - 1.5) * 36 * scale * (onRight ? 1 : -1);
    const spreadY = (row - 1.5) * 24 * scale;
    const sway = reducedMotion ? 0 : Math.sin(time * 1.15 + index * 0.72) * (3 + row) + pointerX * 2;
    const x = originX + spreadX + sway;
    const y = originY + spreadY + Math.cos(time * 0.8 + index) * 2;
    const tone = scene.foliage[index % scene.foliage.length];
    rect(ctx, x - 6 * scale, y, 13 * scale, 4 * scale, tone);
    rect(ctx, x - 2 * scale, y - 4 * scale, 8 * scale, 4 * scale, tone);
    rect(ctx, x - 4 * scale, y + 4 * scale, 8 * scale, 3 * scale, tone);
  }
}

function drawArm(ctx, side, swing, skin, sleeve) {
  rect(ctx, side * 4, -15, 3, 7, sleeve);
  rect(ctx, side * (5 + swing), -9, 3, 5, skin);
}

function drawLeg(ctx, side, swing, trousers, shoe) {
  rect(ctx, side * 3 + swing, -7, 4, 7, trousers);
  rect(ctx, side * 3 + swing, 0, 4, 4, trousers);
  rect(ctx, side * 3 + swing + (side > 0 ? 0 : -1), 4, 5, 2, shoe);
}

function drawWalker(ctx, x, y, time, direction, scene, scale = 3) {
  const frame = Math.floor(time * 8) % 4;
  const swing = frame === 0 ? -2 : frame === 2 ? 2 : 0;
  const bob = frame % 2;
  const skin = '#d99a67';
  const hair = '#211d23';
  const shoe = '#211a1a';

  rect(ctx, x - 9 * scale, y + 4 * scale, 18 * scale, Math.max(2, scale), 'rgba(15,18,20,.32)');
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y - bob * scale));
  ctx.scale(direction * scale, scale);

  drawLeg(ctx, -1, swing, scene.trousers, shoe);
  drawLeg(ctx, 1, -swing, scene.trousers, shoe);
  rect(ctx, -6, -18, 12, 13, '#211c20');
  rect(ctx, -5, -17, 10, 11, scene.shirt);
  rect(ctx, -4, -16, 2, 8, scene.accent);
  rect(ctx, -4, -8, 8, 3, scene.trousers);
  drawArm(ctx, -1, -swing, skin, scene.shirt);
  drawArm(ctx, 1, swing, skin, scene.shirt);
  rect(ctx, -4, -25, 9, 9, '#211c20');
  rect(ctx, -3, -24, 7, 7, skin);
  rect(ctx, -3, -25, 7, 3, hair);
  rect(ctx, 3, -21, 2, 2, '#2b1d18');
  rect(ctx, 2, -23, 1, 1, '#f9dfb3');

  if (scene.role !== 'maker') {
    rect(ctx, -7, -27, 15, 2, '#3f2a1d');
    rect(ctx, -6, -28, 13, 2, '#8f5b2c');
    rect(ctx, -4, -30, 9, 2, '#c4873c');
    rect(ctx, -2, -32, 5, 2, '#e1ad52');
  } else {
    rect(ctx, -4, -27, 8, 3, '#1c2737');
    rect(ctx, -7, -16, 3, 10, '#304052');
    rect(ctx, -8, -13, 2, 5, scene.accent);
  }

  if (scene.role === 'porter') {
    rect(ctx, 7, -16, 8, 8, '#8b552c');
    rect(ctx, 8, -15, 6, 2, '#d49a49');
  }
  if (scene.role === 'child') {
    rect(ctx, -8, -18, 3, 8, '#f4d35e');
  }

  ctx.restore();
}

function drawBird(ctx, x, y, flap, color, scale = 2) {
  rect(ctx, x, y, 3 * scale, 2 * scale, color);
  rect(ctx, x - 3 * scale, y - flap * scale, 3 * scale, 2 * scale, color);
  rect(ctx, x + 3 * scale, y - flap * scale, 3 * scale, 2 * scale, color);
}

function drawBirds(ctx, viewport, time, energy, reducedMotion) {
  const count = 3 + Math.round(energy * 5);
  for (let index = 0; index < count; index += 1) {
    const travel = reducedMotion ? index * 58 : (time * (22 + index * 2) + index * 97) % (viewport.width + 150);
    const x = travel - 60;
    const y = viewport.height * 0.2 + (index % 3) * 23 + Math.sin(time * 1.3 + index) * 8;
    const flap = Math.sin(time * 9 + index) > 0 ? 2 : 0;
    drawBird(ctx, x, y, flap, 'rgba(26,35,43,.72)', viewport.width < 600 ? 1 : 1.4);
  }
}

function drawDuck(ctx, x, y, time, direction, scale = 2) {
  const bob = Math.sin(time * 3) > 0 ? 1 : 0;
  ctx.save();
  ctx.translate(x, y + bob * scale);
  ctx.scale(direction * scale, scale);
  rect(ctx, -6, -4, 12, 5, '#6b4a28');
  rect(ctx, 3, -8, 5, 5, '#286c52');
  rect(ctx, 7, -6, 4, 2, '#e6ad35');
  rect(ctx, 5, -7, 1, 1, '#fff7d6');
  rect(ctx, -4, -5, 5, 2, '#b78643');
  ctx.restore();
  rect(ctx, x - direction * 21 * scale, y + 4 * scale, 17 * scale, 1, 'rgba(220,248,245,.55)');
  rect(ctx, x - direction * 14 * scale, y + 7 * scale, 10 * scale, 1, 'rgba(220,248,245,.32)');
}

function drawChicken(ctx, x, y, time, direction, scale = 2) {
  const peck = Math.floor(time * 2.4) % 4 === 0 ? 3 : 0;
  const step = Math.floor(time * 8) % 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction * scale, scale);
  rect(ctx, -5, -6, 10, 6, '#b84e2c');
  rect(ctx, 2 + peck, -10 + peck, 6, 6, '#d66b31');
  rect(ctx, 7 + peck, -7 + peck, 3, 2, '#f2bf3e');
  rect(ctx, 3 + peck, -12 + peck, 3, 2, '#df3d35');
  rect(ctx, -8, -8, 4, 4, '#7a3228');
  rect(ctx, -3 + step, 0, 2, 4, '#a45a2b');
  rect(ctx, 3 - step, 0, 2, 4, '#a45a2b');
  ctx.restore();
}

function drawBuffalo(ctx, x, y, time, direction, scale = 2) {
  const step = Math.floor(time * 3) % 2;
  const tail = Math.sin(time * 4) > 0 ? 3 : -2;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction * scale, scale);
  rect(ctx, -13, -12, 25, 12, '#443b34');
  rect(ctx, 7, -16, 11, 10, '#54483e');
  rect(ctx, 15, -18, 5, 3, '#332c29');
  rect(ctx, 11, -18, 2, 4, '#d8c49d');
  rect(ctx, 17, -18, 2, 4, '#d8c49d');
  rect(ctx, -10 + step, 0, 3, 9, '#302925');
  rect(ctx, 7 - step, 0, 3, 9, '#302925');
  rect(ctx, -16, -11, 4, 2, '#342b27');
  rect(ctx, -18, -10 + tail, 2, 7, '#342b27');
  ctx.restore();
}

function drawDog(ctx, x, y, time, direction, scale = 2) {
  const step = Math.floor(time * 9) % 2;
  const tail = Math.sin(time * 8) > 0 ? -5 : -2;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(direction * scale, scale);
  rect(ctx, -7, -8, 14, 7, '#ae7139');
  rect(ctx, 5, -12, 7, 7, '#c78643');
  rect(ctx, 8, -13, 3, 3, '#5f3b25');
  rect(ctx, 11, -9, 3, 2, '#33251e');
  rect(ctx, -5 + step, -1, 3, 7, '#7a4c2c');
  rect(ctx, 4 - step, -1, 3, 7, '#7a4c2c');
  rect(ctx, -10, -8, 4, 2, '#81502e');
  rect(ctx, -13, -11 + tail, 4, 3, '#81502e');
  ctx.restore();
}

function drawCat(ctx, x, y, time, scale = 2) {
  const tailX = Math.sin(time * 3) * 5;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  rect(ctx, -4, -9, 8, 9, '#d1a15d');
  rect(ctx, -4, -14, 8, 6, '#ddb26b');
  rect(ctx, -4, -17, 3, 4, '#ddb26b');
  rect(ctx, 1, -17, 3, 4, '#ddb26b');
  rect(ctx, -2, -12, 1, 1, '#173849');
  rect(ctx, 2, -12, 1, 1, '#173849');
  rect(ctx, 4, -8, 3, 7, '#b9864b');
  rect(ctx, 6 + tailX, -5, 3, 3, '#b9864b');
  ctx.restore();
}

function drawSampan(ctx, x, y, time, direction, scale = 2) {
  const bob = Math.sin(time * 2.1) * scale;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(direction * scale, scale);
  rect(ctx, -20, -4, 40, 4, '#3d251b');
  rect(ctx, -16, 0, 32, 6, '#82502a');
  rect(ctx, -11, 6, 22, 2, '#34221a');
  rect(ctx, -3, -14, 6, 10, '#486f6a');
  rect(ctx, -2, -20, 5, 6, '#d59b65');
  rect(ctx, -4, -22, 10, 2, '#c99346');
  rect(ctx, 8, -18, 2, 17, '#5b3821');
  rect(ctx, 9, -18, 15, 2, '#8b5b2f');
  ctx.restore();
  rect(ctx, x - direction * 62 * scale, y + 12, 50 * scale, 2, 'rgba(224,250,250,.42)');
}

function drawWindPlants(ctx, viewport, scene, time, reducedMotion, pointerX) {
  if (scene.role === 'maker' || scene.role === 'porter') return;
  const onRight = scene.artSide === 'right';
  const startX = viewport.width * (onRight ? 0.48 : 0.02);
  const endX = viewport.width * (onRight ? 0.98 : 0.52);
  const baseline = viewport.height * 0.965;
  const count = Math.max(10, Math.round(viewport.width / 72));
  for (let index = 0; index < count; index += 1) {
    const x = startX + (endX - startX) * (index / Math.max(count - 1, 1));
    const height = 12 + (index * 13) % 20;
    const sway = reducedMotion ? 0 : Math.round(Math.sin(time * 1.6 + index * 0.83) * 3 + pointerX * 1.5);
    rect(ctx, x, baseline - height, 1, height, 'rgba(37,88,48,.52)');
    rect(ctx, x + sway, baseline - height, 4, 2, 'rgba(103,147,64,.58)');
    rect(ctx, x - 3 + sway * 0.5, baseline - height * 0.56, 4, 2, 'rgba(66,121,57,.5)');
    if (index % 5 === 0) rect(ctx, x + sway, baseline - height - 2, 2, 2, scene.accent);
  }
}

function drawRiceWave(ctx, viewport, time, strength, rightSide) {
  const start = viewport.width * (rightSide ? 0.54 : 0.03);
  const width = viewport.width * 0.42;
  for (let row = 0; row < 4; row += 1) {
    for (let index = 0; index < 18; index += 1) {
      const x = start + (index / 17) * width;
      const sway = Math.sin(time * (1.2 + row * 0.08) + index * 0.45 + row) * (2 + strength * 3);
      const y = viewport.height * (0.55 + row * 0.035);
      rect(ctx, x + sway, y - 8, 2, 9, `rgba(178,192,74,${0.26 + strength * 0.12})`);
      rect(ctx, x + sway + 2, y - 7, 4, 2, `rgba(222,202,83,${0.25 + strength * 0.15})`);
    }
  }
}

function drawFlags(ctx, viewport, time, energy) {
  const y = viewport.height * 0.17;
  const start = viewport.width * 0.63;
  rect(ctx, start, y, viewport.width * 0.29, 2, 'rgba(62,43,29,.7)');
  const colors = ['#e85e3c', '#f2b73e', '#3b86b5', '#d84f47'];
  for (let index = 0; index < 5; index += 1) {
    const x = start + index * viewport.width * 0.057;
    const flap = Math.round((Math.sin(time * (3.2 + energy) + index) + 1) * 3);
    rect(ctx, x, y, 2, 23, '#5c3b23');
    rect(ctx, x + 2, y + 3, 15 + flap, 8, colors[index % colors.length]);
    rect(ctx, x + 9 + flap, y + 11, 8, 5, colors[index % colors.length]);
  }
}

function drawWorkshopPulse(ctx, viewport, time, energy) {
  const centerX = viewport.width * 0.29;
  const centerY = viewport.height * 0.52;
  const spin = time * (5 + energy * 8);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(spin);
  for (let index = 0; index < 4; index += 1) {
    ctx.rotate(Math.PI / 2);
    rect(ctx, 0, -2, 22, 5, 'rgba(104,188,179,.56)');
    rect(ctx, 16, -4, 7, 3, 'rgba(225,201,123,.46)');
  }
  rect(ctx, -3, -3, 6, 6, '#d5a54f');
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const screenX = viewport.width * 0.17;
  const screenY = viewport.height * 0.55;
  const glow = 0.08 + (Math.sin(time * 4) + 1) * 0.035 + energy * 0.18;
  rect(ctx, screenX - 25, screenY - 18, 52, 32, `rgba(72,235,219,${glow})`);
  ctx.restore();
}

function drawLanterns(ctx, viewport, time, energy) {
  const startX = viewport.width * 0.57;
  const y = viewport.height * 0.42;
  const colors = ['#ffbd45', '#ff5b61', '#c66bea', '#f68b3c'];
  rect(ctx, startX, y - 17, viewport.width * 0.37, 2, 'rgba(62,38,26,.76)');
  for (let index = 0; index < 6; index += 1) {
    const x = startX + index * viewport.width * 0.066;
    const bob = Math.sin(time * 1.5 + index) * (2 + energy * 2);
    const alpha = 0.72 + Math.sin(time * 4 + index) * 0.16;
    rect(ctx, x, y + bob - 15, 2, 9, '#573020');
    rect(ctx, x - 6, y + bob - 7, 14, 15, colors[index % colors.length]);
    rect(ctx, x - 3, y + bob - 4, 8, 9, `rgba(255,238,137,${alpha})`);
    rect(ctx, x - 4, y + bob + 8, 10, 2, '#573020');
  }
}

function drawNightLife(ctx, viewport, time, energy) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const stoveX = viewport.width * 0.2;
  const stoveY = viewport.height * 0.66;
  const flame = 7 + Math.sin(time * 13) * 3 + energy * 8;
  rect(ctx, stoveX - 9, stoveY - flame, 18, flame + 6, `rgba(255,93,31,${0.2 + energy * 0.2})`);
  rect(ctx, stoveX - 4, stoveY - flame - 3, 8, flame, '#ffd45b');
  for (let index = 0; index < 7 + energy * 14; index += 1) {
    const life = (time * (0.45 + index % 4 * 0.08) + index * 0.13) % 1;
    rect(ctx, stoveX + Math.sin(index * 4.7) * 32, stoveY - 18 - life * 80, 3, 3, index % 2 ? '#ffd75d' : '#ff763f');
  }
  ctx.restore();
}

function drawSceneAnimals(ctx, viewport, sceneId, time, energy, reducedMotion) {
  const movingTime = reducedMotion ? 0 : time * (1 + energy * 0.45);
  if (sceneId === 'hero') {
    const first = routeState(movingTime, 0.055, 0.2);
    const second = routeState(movingTime, 0.042, 1.1);
    drawDuck(ctx, viewport.width * (0.54 + first.position * 0.34), viewport.height * 0.82, movingTime, first.direction, viewport.width < 600 ? 1.3 : 1.8);
    drawDuck(ctx, viewport.width * (0.57 + second.position * 0.28), viewport.height * 0.86, movingTime + 1, second.direction, viewport.width < 600 ? 1.1 : 1.5);
    drawBirds(ctx, viewport, movingTime, energy, reducedMotion);
  } else if (sceneId === 'about') {
    const buffalo = routeState(movingTime, 0.025, 0.6);
    drawBuffalo(ctx, viewport.width * (0.08 + buffalo.position * 0.29), viewport.height * 0.55, movingTime, buffalo.direction, viewport.width < 600 ? 0.9 : 1.35);
    for (let index = 0; index < 3; index += 1) {
      const chicken = routeState(movingTime, 0.08 + index * 0.012, index * 0.47);
      drawChicken(ctx, viewport.width * (0.08 + chicken.position * 0.32), viewport.height * (0.78 + index * 0.025), movingTime + index, chicken.direction, viewport.width < 600 ? 1.2 : 1.7);
    }
  } else if (sceneId === 'projects') {
    const boat = routeState(movingTime, 0.035, 0.35);
    drawSampan(ctx, viewport.width * (0.49 + boat.position * 0.42), viewport.height * 0.69, movingTime, boat.direction, viewport.width < 600 ? 1.1 : 1.65);
    drawBirds(ctx, viewport, movingTime * 0.8, energy * 0.5, reducedMotion);
  } else if (sceneId === 'technology') {
    const dog = routeState(movingTime, 0.075, 0.2);
    drawDog(ctx, viewport.width * (0.07 + dog.position * 0.38), viewport.height * 0.79, movingTime, dog.direction, viewport.width < 600 ? 1.2 : 1.8);
    drawCat(ctx, viewport.width * 0.43, viewport.height * 0.68, movingTime, viewport.width < 600 ? 1.2 : 1.7);
  } else if (sceneId === 'playground') {
    const dog = routeState(movingTime, 0.12, 0.5);
    drawDog(ctx, viewport.width * (0.53 + dog.position * 0.37), viewport.height * 0.79, movingTime * 1.2, dog.direction, viewport.width < 600 ? 1.2 : 1.8);
    drawBirds(ctx, viewport, movingTime, energy, reducedMotion);
  } else if (sceneId === 'contact') {
    drawCat(ctx, viewport.width * 0.39, viewport.height * 0.73, movingTime, viewport.width < 600 ? 1.3 : 1.9);
  }
}

export class LivingSceneRenderer {
  constructor() {
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
    const startedAt = this.interactions.get(sceneId);
    if (startedAt === undefined) return 0;
    const duration = reducedMotion ? 0.65 : 3.2;
    const remaining = 1 - (time - startedAt) / duration;
    if (remaining <= 0) {
      this.interactions.delete(sceneId);
      return 0;
    }
    return clamp(remaining * remaining * (3 - 2 * remaining), 0, 1);
  }

  render(ctx, progress, time, reducedMotion) {
    viewportTransform.applyScreenSpace(ctx);
    const viewport = viewportTransform.getViewportSize();
    const sceneId = getActiveSceneId(progress);
    const scene = SCENE_MOTION[sceneId];
    if (!scene) return;

    const smoothing = reducedMotion ? 1 : 0.12;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * smoothing;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * smoothing;
    const motionTime = reducedMotion ? 0 : time;
    const energy = this.getEnergy(sceneId, time, reducedMotion);

    ctx.save();
    drawCloudLayer(ctx, viewport, scene, motionTime * (1 + energy * 0.35), reducedMotion, this.pointer.x);
    drawCanopySway(ctx, viewport, scene, motionTime * (1 + energy * 0.28), reducedMotion, this.pointer.x);
    drawWindPlants(ctx, viewport, scene, motionTime * (1 + energy * 0.4), reducedMotion, this.pointer.x);

    if (sceneId === 'about') drawRiceWave(ctx, viewport, motionTime, energy, false);
    if (sceneId === 'projects') drawFlags(ctx, viewport, motionTime, energy);
    if (sceneId === 'technology') drawWorkshopPulse(ctx, viewport, motionTime, energy);
    if (sceneId === 'playground') drawLanterns(ctx, viewport, motionTime, energy);
    if (sceneId === 'contact') drawNightLife(ctx, viewport, motionTime, energy);

    drawSceneAnimals(ctx, viewport, sceneId, motionTime, energy, reducedMotion);

    const isMobile = viewport.width < 820;
    const groundY = viewport.height * (isMobile ? scene.mobileGroundY : scene.groundY);
    const route = routeState(motionTime, scene.role === 'child' ? 0.095 : 0.055, 0.16);
    const x = viewport.width * (scene.route[0] + (scene.route[1] - scene.route[0]) * route.position);
    const characterScale = isMobile ? 1.25 : clamp(viewport.width / 700, 1.75, 2.15);
    const hasVisibleGroundRoute = viewport.width >= 600 && viewport.width / Math.max(viewport.height, 1) >= 0.9;
    if (hasVisibleGroundRoute) {
      drawWalker(ctx, x + this.pointer.x * 5, groundY, motionTime * (1 + energy * 0.45), route.direction, scene, characterScale);
    }
    ctx.restore();
  }
}
