import { SCENE_LAYOUT } from '../data/sceneLayout';
import { viewportTransform } from '../core/ViewportTransform';

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function outlined(ctx, x, y, w, h, fill, edge = '#2a160d', size = 3) {
  rect(ctx, x - size, y - size, w + size * 2, h + size * 2, edge);
  rect(ctx, x, y, w, h, fill);
}

function pixelDisc(ctx, cx, cy, radius, color, step = 4) {
  for (let y = -radius; y <= radius; y += step) {
    const half = Math.floor(Math.sqrt(Math.max(0, radius * radius - y * y)) / step) * step;
    rect(ctx, cx - half, cy + y, half * 2 + step, step, color);
  }
}

function drawCloud(ctx, x, y, tone = '#fff4d4') {
  rect(ctx, x + 8, y, 32, 8, tone);
  rect(ctx, x, y + 8, 56, 10, tone);
  rect(ctx, x + 16, y - 6, 22, 8, tone);
  rect(ctx, x + 8, y + 18, 40, 3, 'rgba(126, 148, 159, .35)');
}

function drawPalm(ctx, x, groundY, time, scale = 1) {
  const sway = Math.round(Math.sin(time * 0.7 + x) * 2);
  rect(ctx, x - 4, groundY - 72 * scale, 9, 73 * scale, '#5b351a');
  rect(ctx, x, groundY - 72 * scale, 4, 73 * scale, '#9a5c2b');
  const top = groundY - 70 * scale;
  rect(ctx, x - 44 * scale + sway, top - 8, 44 * scale, 7, '#0d6b3c');
  rect(ctx, x + 4, top - 8, 44 * scale + sway, 7, '#128548');
  rect(ctx, x - 32 * scale + sway, top - 22, 34 * scale, 7, '#159447');
  rect(ctx, x + 1, top - 24, 34 * scale + sway, 7, '#1da653');
  rect(ctx, x - 26 * scale, top + 4, 28 * scale, 7, '#0d743d');
  rect(ctx, x + 2, top + 3, 29 * scale, 7, '#168a44');
  rect(ctx, x - 5, top - 3, 5, 5, '#6f3c1b');
  rect(ctx, x + 3, top - 1, 5, 5, '#8f5122');
}

function drawBanana(ctx, x, groundY, time) {
  const sway = Math.round(Math.sin(time * 0.9 + x * 0.1) * 2);
  rect(ctx, x - 2, groundY - 47, 5, 48, '#4c7a26');
  rect(ctx, x - 34 + sway, groundY - 50, 32, 9, '#1c8e45');
  rect(ctx, x + 2, groundY - 56, 34 + sway, 9, '#20a653');
  rect(ctx, x - 24, groundY - 68, 24 + sway, 9, '#35b95e');
  rect(ctx, x + 1, groundY - 72, 26, 9, '#289f50');
}

function drawGround(ctx, x, y, w, grass = '#2f8f46') {
  rect(ctx, x, y, w, 8, grass);
  rect(ctx, x, y + 8, w, 34, '#77451e');
  rect(ctx, x + 8, y + 16, w - 16, 5, '#9a602c');
  for (let i = 0; i < w; i += 28) rect(ctx, x + i, y - 5 - (i % 3), 4, 7, '#51b353');
}

function drawHouse(ctx, x, y, scale = 1, lamp = false) {
  const w = 142 * scale;
  const h = 70 * scale;
  rect(ctx, x - 10 * scale, y + h - 4, w + 20 * scale, 8 * scale, '#392319');
  outlined(ctx, x, y, w, h, '#7a3f24', '#2c1812', 3 * scale);
  rect(ctx, x + 8 * scale, y + 8 * scale, w - 16 * scale, 9 * scale, '#a96032');
  rect(ctx, x + 14 * scale, y + 25 * scale, 34 * scale, 45 * scale, '#4b271c');
  rect(ctx, x + 63 * scale, y + 23 * scale, 28 * scale, 24 * scale, lamp ? '#ffe08a' : '#9fd4d1');
  rect(ctx, x + 68 * scale, y + 28 * scale, 18 * scale, 14 * scale, lamp ? '#fff3b0' : '#d5f0e3');
  rect(ctx, x + 102 * scale, y + 23 * scale, 27 * scale, 24 * scale, '#4b271c');
  rect(ctx, x - 18 * scale, y - 28 * scale, w + 36 * scale, 11 * scale, '#45271a');
  rect(ctx, x - 8 * scale, y - 38 * scale, w + 16 * scale, 11 * scale, '#7a4822');
  rect(ctx, x + 10 * scale, y - 48 * scale, w - 20 * scale, 10 * scale, '#a96a31');
  rect(ctx, x + 28 * scale, y - 55 * scale, w - 56 * scale, 7 * scale, '#c5833c');
}

function drawLotus(ctx, x, y, time, phase = 0) {
  const bob = Math.round(Math.sin(time * 1.2 + phase) * 2);
  rect(ctx, x - 8, y + bob, 18, 4, '#23724b');
  rect(ctx, x, y - 9 + bob, 3, 10, '#3d9562');
  rect(ctx, x - 6, y - 13 + bob, 6, 6, '#f06d9c');
  rect(ctx, x + 1, y - 15 + bob, 6, 8, '#ff93b8');
  rect(ctx, x + 7, y - 12 + bob, 5, 5, '#dc4f84');
}

function drawPerson(ctx, x, y, time, laptop = false) {
  const hand = Math.floor(time * 4) % 2;
  rect(ctx, x - 6, y - 42, 14, 13, '#d99b68');
  rect(ctx, x - 7, y - 46, 16, 6, '#17243a');
  rect(ctx, x - 8, y - 29, 18, 24, '#247b62');
  rect(ctx, x - 7, y - 5, 6, 15, '#24344c');
  rect(ctx, x + 4, y - 5, 6, 15, '#24344c');
  if (laptop) {
    rect(ctx, x + 11, y - 25 + hand, 18, 12, '#17202f');
    rect(ctx, x + 14, y - 22 + hand, 12, 7, '#62d8c7');
    rect(ctx, x + 8, y - 12, 25, 3, '#26384a');
  } else {
    rect(ctx, x + 9, y - 28 + hand * 3, 5, 17, '#d99b68');
  }
}

function drawBoat(ctx, x, y, time, scale = 1) {
  const bob = Math.round(Math.sin(time * 1.1 + x) * 2);
  rect(ctx, x, y + bob, 126 * scale, 8 * scale, '#351c15');
  rect(ctx, x + 9 * scale, y + 8 * scale + bob, 108 * scale, 20 * scale, '#82421f');
  rect(ctx, x + 20 * scale, y + 27 * scale + bob, 88 * scale, 7 * scale, '#3c2118');
  rect(ctx, x + 23 * scale, y - 15 * scale + bob, 30 * scale, 16 * scale, '#d58b2f');
  rect(ctx, x + 59 * scale, y - 20 * scale + bob, 24 * scale, 21 * scale, '#6e9c35');
  rect(ctx, x + 88 * scale, y - 13 * scale + bob, 20 * scale, 14 * scale, '#d95f32');
  rect(ctx, x + 69 * scale, y - 31 * scale + bob, 3 * scale, 22 * scale, '#4b2b1c');
  rect(ctx, x + 72 * scale, y - 31 * scale + bob, 26 * scale, 14 * scale, '#f1be45');
}

function drawHero(ctx, a, time) {
  const x = a.x; const y = a.y;
  pixelDisc(ctx, x + 205, y - 108 + Math.sin(time * 0.12) * 3, 25, '#ffd25f');
  drawCloud(ctx, x + 58 + (time * 2 % 35), y - 125);
  drawCloud(ctx, x + 225 - (time * 1.4 % 28), y - 82, '#ffe9c7');
  drawGround(ctx, x + 35, y + 60, 285);
  drawHouse(ctx, x + 88, y - 2, 0.9);
  drawPalm(ctx, x + 55, y + 65, time, 0.9);
  rect(ctx, x + 210, y + 66, 118, 8, '#4b2c1b');
  rect(ctx, x + 225, y + 74, 6, 35, '#3b2419');
  rect(ctx, x + 302, y + 74, 6, 35, '#3b2419');
  drawPerson(ctx, x + 245, y + 67, time, true);
  drawLotus(ctx, x + 92, y + 111, time, 1);
  drawLotus(ctx, x + 155, y + 125, time, 2.4);
  rect(ctx, x + 260, y - 72, 10, 3, '#3b2c29');
  rect(ctx, x + 270, y - 68, 10, 3, '#3b2c29');
}

function drawAbout(ctx, a, time) {
  const x = a.x; const y = a.y;
  drawGround(ctx, x - 318, y + 72, 286, '#3f9b43');
  drawPalm(ctx, x - 280, y + 74, time, 0.85);
  drawBanana(ctx, x - 64, y + 72, time);
  rect(ctx, x - 275, y + 68, 206, 8, '#3b2417');
  for (let i = 0; i < 7; i += 1) {
    rect(ctx, x - 265 + i * 29, y + 56 - Math.abs(3 - i) * 5, 26, 7, '#b06a31');
    rect(ctx, x - 254 + i * 29, y + 62 - Math.abs(3 - i) * 5, 5, 22, '#4d2b19');
  }
  const ear = Math.floor(time * 1.8) % 2;
  rect(ctx, x - 225, y + 22, 54, 27, '#514334');
  rect(ctx, x - 180, y + 13, 24, 22, '#625141');
  rect(ctx, x - 186 - ear * 3, y + 10, 12, 6, '#302820');
  rect(ctx, x - 218, y + 48, 7, 22, '#332b24');
  rect(ctx, x - 180, y + 48, 7, 22, '#332b24');
  drawPerson(ctx, x - 106, y + 71, time, false);
  const peck = Math.floor(time * 2.2) % 3 === 0 ? 5 : 0;
  rect(ctx, x - 67, y + 49 + peck, 14, 12, '#c65e2c');
  rect(ctx, x - 54, y + 52 + peck, 7, 4, '#f0bd3a');
  rect(ctx, x - 63, y + 61 + peck, 3, 8, '#8a3b24');
}

function drawProjects(ctx, a, time) {
  const x = a.x; const y = a.y;
  drawGround(ctx, x + 35, y + 72, 280, '#459247');
  drawPalm(ctx, x + 278, y + 73, time, 0.82);
  rect(ctx, x + 55, y + 44, 8, 77, '#4a2b1c');
  rect(ctx, x + 65, y + 50, 112, 9, '#8b5229');
  for (let i = 0; i < 5; i += 1) rect(ctx, x + 72 + i * 22, y + 58, 5, 44, '#4a2b1c');
  drawBoat(ctx, x + 155, y + 78, time, 1.15);
  drawBoat(ctx, x + 46, y + 118, time + 1.9, 0.72);
  outlined(ctx, x + 88, y - 9, 76, 52, '#724023');
  rect(ctx, x + 77, y - 24, 98, 13, '#bd7534');
  rect(ctx, x + 93, y + 2, 20, 24, '#3c2419');
  rect(ctx, x + 128, y + 3, 22, 16, '#f6d57a');
}

function drawTechnology(ctx, a, time) {
  const x = a.x; const y = a.y;
  drawGround(ctx, x - 318, y + 77, 292, '#397f3d');
  outlined(ctx, x - 298, y - 48, 236, 126, '#6c3d24');
  rect(ctx, x - 315, y - 69, 270, 15, '#9d5f31');
  rect(ctx, x - 286, y - 37, 64, 7, '#ae6b35');
  rect(ctx, x - 286, y - 31, 5, 43, '#4a2819');
  rect(ctx, x - 227, y - 31, 5, 43, '#4a2819');
  const badgeColors = ['#57c7d4', '#f2b84b', '#53b96f', '#b78be5'];
  for (let i = 0; i < 4; i += 1) outlined(ctx, x - 275 + (i % 2) * 27, y - 25 + Math.floor(i / 2) * 22, 19, 13, badgeColors[i], '#2a1b16', 2);
  rect(ctx, x - 198, y + 35, 112, 8, '#b4763b');
  rect(ctx, x - 190, y + 43, 7, 34, '#4b2b1c');
  rect(ctx, x - 101, y + 43, 7, 34, '#4b2b1c');
  outlined(ctx, x - 169, y - 5, 62, 39, '#18263a');
  rect(ctx, x - 163, y + 1, 50, 27, '#163f51');
  const codeY = Math.floor(time * 1.3) % 3;
  rect(ctx, x - 157, y + 6 + codeY * 6, 28, 3, '#62ddbf');
  rect(ctx, x - 151, y + 12 + codeY * 4, 34, 3, '#f2c454');
  rect(ctx, x - 174, y + 34, 72, 5, '#252f3b');
  drawPerson(ctx, x - 208, y + 53, time + 0.6, true);
  outlined(ctx, x - 91, y - 32, 40, 40, '#ead07c', '#3b2417', 3);
  const fanFrame = Math.floor(time * 5) % 4;
  rect(ctx, x - 73 + (fanFrame % 2 ? -13 : -3), y - 18, fanFrame % 2 ? 30 : 9, 5, '#73523a');
  rect(ctx, x - 71, y - 30 + (fanFrame % 2 ? 9 : 0), 5, fanFrame % 2 ? 9 : 30, '#73523a');
  rect(ctx, x - 72, y - 19, 8, 8, '#d39b42');
  rect(ctx, x - 57, y + 11, 6, 14, '#e1a541');
  rect(ctx, x - 61, y + 23, 14, 4, '#6b351d');
}

function drawPlayground(ctx, a, time) {
  const x = a.x; const y = a.y;
  drawGround(ctx, x + 31, y + 74, 289, '#347c3e');
  drawHouse(ctx, x + 210, y + 12, 0.62, true);
  const kiteX = x + 160 + Math.sin(time * 0.7) * 12;
  const kiteY = y - 107 + Math.cos(time * 0.9) * 7;
  rect(ctx, kiteX, kiteY, 16, 16, '#e44c4c');
  rect(ctx, kiteX + 4, kiteY - 4, 8, 24, '#f58b45');
  for (let i = 0; i < 7; i += 1) rect(ctx, kiteX - 2 - i * 12, kiteY + 16 + i * 12 + Math.sin(time + i) * 3, 13, 2, '#43291c');
  rect(ctx, x + 54, y - 14, 250, 3, '#3f2b20');
  for (let i = 0; i < 5; i += 1) {
    const glow = 0.72 + Math.sin(time * 2 + i) * 0.18;
    rect(ctx, x + 70 + i * 50, y - 11, 18, 24, `rgba(255, 188, 67, ${glow})`);
    rect(ctx, x + 67 + i * 50, y - 14, 24, 4, '#692f1e');
    rect(ctx, x + 70 + i * 50, y + 13, 18, 4, '#692f1e');
  }
  rect(ctx, x + 98, y + 31, 6, 44, '#5a321e');
  const spin = Math.floor(time * 7) % 4;
  rect(ctx, x + 101 - (spin % 2 ? 18 : 4), y + 26, spin % 2 ? 40 : 9, 6, '#6dd0cf');
  rect(ctx, x + 99, y + 10 + (spin % 2 ? 13 : 0), 6, spin % 2 ? 9 : 40, '#f27958');
  rect(ctx, x + 98, y + 25, 10, 10, '#f4c24f');
  for (let i = 0; i < 7; i += 1) {
    const pulse = Math.sin(time * 2 + i * 1.7);
    if (pulse > -0.15) rect(ctx, x + 55 + i * 38, y + 32 + Math.sin(time + i) * 17, 3, 3, '#e7f66b');
  }
}

function drawContact(ctx, a, time) {
  const x = a.x; const y = a.y;
  pixelDisc(ctx, x - 205, y - 108, 31, '#f7e7a9');
  rect(ctx, x - 236, y + 96, 63, 4, 'rgba(247,231,169,.5)');
  rect(ctx, x - 226, y + 106, 44, 3, 'rgba(247,231,169,.35)');
  drawGround(ctx, x - 318, y + 70, 289, '#174d38');
  drawHouse(ctx, x - 302, y + 5, 0.67, true);
  outlined(ctx, x - 145, y + 35, 58, 34, '#8e3822', '#321817', 3);
  rect(ctx, x - 139, y + 43, 46, 8, '#c15128');
  const flicker = Math.floor(time * 8) % 3;
  pixelDisc(ctx, x - 116, y + 31 - flicker, 11 + flicker, 'rgba(242, 103, 34, .38)', 4);
  rect(ctx, x - 124, y + 38, 17, 19, '#f05b28');
  rect(ctx, x - 120, y + 32 - flicker, 10, 20, '#ffc94f');
  rect(ctx, x - 117, y + 39, 5, 12, '#fff2a3');
  outlined(ctx, x - 89, y + 20, 24, 23, '#5b6470', '#241a18', 2);
  rect(ctx, x - 84, y + 13, 14, 8, '#727d88');
  rect(ctx, x - 70, y + 25, 13, 4, '#727d88');
  for (let i = 0; i < 6; i += 1) {
    const smokeX = Math.sin(time * 0.8 + i) * 7;
    rect(ctx, x - 78 + smokeX, y + 5 - ((time * 9 + i * 15) % 64), 5 + i % 2, 5 + i % 2, `rgba(205, 211, 218, ${0.42 - i * 0.045})`);
  }
  drawPalm(ctx, x - 45, y + 71, time, 0.7);
}

function drawTransitionCorridor(ctx, progress, time, virtual) {
  const transitionPoints = [0.14, 0.32, 0.5, 0.68, 0.86];
  let distance = 1;
  for (const point of transitionPoints) distance = Math.min(distance, Math.abs(progress - point));
  if (distance >= 0.045) return;

  const alpha = 1 - distance / 0.045;
  const late = progress > 0.7;
  const grass = late ? '#174d38' : '#2f7d3f';
  const earth = late ? '#41251c' : '#68401f';
  ctx.save();
  ctx.globalAlpha = alpha * 0.92;

  rect(ctx, 0, virtual.height - 58, 142, 58, earth);
  rect(ctx, 0, virtual.height - 62, 151, 7, grass);
  rect(ctx, virtual.width - 146, virtual.height - 50, 146, 50, earth);
  rect(ctx, virtual.width - 154, virtual.height - 55, 154, 7, grass);

  for (let i = 0; i < 4; i += 1) {
    const baseX = 25 + i * 18;
    rect(ctx, baseX, virtual.height - 151 + i * 4, 5, 93 - i * 4, late ? '#365b32' : '#477b34');
    rect(ctx, baseX - 20, virtual.height - 144 + i * 9, 20, 6, grass);
    rect(ctx, baseX + 5, virtual.height - 134 + i * 8, 25, 6, grass);
  }

  rect(ctx, virtual.width - 70, virtual.height - 133, 5, 82, '#574126');
  rect(ctx, virtual.width - 102, virtual.height - 136, 36, 7, grass);
  rect(ctx, virtual.width - 66, virtual.height - 149, 38, 7, grass);
  rect(ctx, virtual.width - 97, virtual.height - 121, 31, 7, grass);

  const bob = Math.round(Math.sin(time * 1.3) * 2);
  rect(ctx, virtual.width / 2 - 45, virtual.height - 78 + bob, 92, 6, '#321c17');
  rect(ctx, virtual.width / 2 - 35, virtual.height - 72 + bob, 72, 13, '#8a4c25');
  rect(ctx, virtual.width / 2 - 26, virtual.height - 59 + bob, 53, 5, '#3d241b');
  rect(ctx, virtual.width / 2 + 22, virtual.height - 103 + bob, 3, 31, '#59331e');
  rect(ctx, virtual.width / 2 + 25, virtual.height - 103 + bob, 25, 13, late ? '#e8913f' : '#edc45e');

  if (late) {
    for (let i = 0; i < 5; i += 1) {
      if (Math.sin(time * 2 + i * 1.8) > -0.1) rect(ctx, 175 + i * 68, 205 + Math.sin(time + i) * 24, 3, 3, '#e7f66b');
    }
  }
  ctx.restore();
}

const DRAWERS = { hero: drawHero, about: drawAbout, projects: drawProjects, technology: drawTechnology, playground: drawPlayground, contact: drawContact };

function sceneAlpha(scene, progress) {
  const fade = 0.04;
  const visibleStart = Math.max(0, scene.holdStart - fade);
  const visibleEnd = Math.min(1, scene.holdEnd + fade);
  if (progress < visibleStart || progress > visibleEnd) return 0;
  const fadeIn = visibleStart === 0 ? 1 : (progress - visibleStart) / fade;
  const fadeOut = visibleEnd === 1 ? 1 : (visibleEnd - progress) / fade;
  return Math.max(0, Math.min(1, fadeIn, fadeOut));
}

export class WorldArtRenderer {
  static render(ctx, cameraPos, progress, time, reducedMotion) {
    const virtual = viewportTransform.getVirtualSize();
    const viewport = viewportTransform.getViewportSize();
    const portrait = viewport.width / Math.max(viewport.height, 1) < 1;
    const compactPortrait = viewport.width < 700;
    ctx.save();
    ctx.translate(Math.round(virtual.width / 2 - cameraPos.x), Math.round(virtual.height / 2 - cameraPos.y));
    const animationTime = reducedMotion ? 0 : time;
    for (const scene of SCENE_LAYOUT) {
      const alpha = sceneAlpha(scene, progress);
      if (alpha <= 0) continue;
      const anchor = reducedMotion ? { x: scene.anchor.x * 0.22, y: scene.anchor.y } : scene.anchor;
      ctx.save();
      ctx.globalAlpha = alpha;
      if (portrait) {
        const direction = scene.artSide === 'right' ? 1 : -1;
        const scale = compactPortrait ? 0.52 : 0.7;
        const sideShift = compactPortrait ? 160 : 145;
        const lift = compactPortrait ? 100 : 72;
        ctx.translate(anchor.x, anchor.y - lift);
        ctx.scale(scale, scale);
        ctx.translate(-anchor.x - direction * sideShift, -anchor.y);
      }
      DRAWERS[scene.id](ctx, anchor, animationTime);
      ctx.restore();
    }
    ctx.restore();
    drawTransitionCorridor(ctx, progress, animationTime, virtual);
  }
}
