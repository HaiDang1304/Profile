import { SCENE_LAYOUT } from './sceneLayout';

export const cameraPath = SCENE_LAYOUT.flatMap((scene) => [
  { progress: scene.holdStart, ...scene.anchor, name: `${scene.id.toUpperCase()}_IN` },
  { progress: scene.holdEnd, ...scene.anchor, name: `${scene.id.toUpperCase()}_HOLD` },
]);

function smootherStep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function sampleCameraPath(progress, reduceHorizontal = false) {
  const p = Math.max(0, Math.min(1, progress));
  const first = SCENE_LAYOUT[0];
  for (let index = 0; index < SCENE_LAYOUT.length; index += 1) {
    const scene = SCENE_LAYOUT[index];
    if (p >= scene.holdStart && p <= scene.holdEnd) {
      return { x: reduceHorizontal ? first.anchor.x + (scene.anchor.x - first.anchor.x) * 0.22 : scene.anchor.x, y: scene.anchor.y };
    }
    const next = SCENE_LAYOUT[index + 1];
    if (next && p > scene.holdEnd && p < next.holdStart) {
      const t = smootherStep((p - scene.holdEnd) / (next.holdStart - scene.holdEnd));
      const x = scene.anchor.x + (next.anchor.x - scene.anchor.x) * t;
      return { x: reduceHorizontal ? first.anchor.x + (x - first.anchor.x) * 0.22 : x, y: scene.anchor.y + (next.anchor.y - scene.anchor.y) * t };
    }
  }
  const last = SCENE_LAYOUT[SCENE_LAYOUT.length - 1];
  return { x: reduceHorizontal ? first.anchor.x + (last.anchor.x - first.anchor.x) * 0.22 : last.anchor.x, y: last.anchor.y };
}
