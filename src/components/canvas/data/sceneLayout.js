const LAYERS = [
  { id: 'layer_far_sky', name: 'Bầu trời', depth: 1, cameraFactor: 0.1, visible: true },
  { id: 'layer_far_landscape', name: 'Cảnh xa', depth: 2, cameraFactor: 0.25, visible: true },
  { id: 'layer_mid_ground', name: 'Trung cảnh', depth: 3, cameraFactor: 0.6, visible: true },
  { id: 'layer_main_world', name: 'Cảnh chính', depth: 4, cameraFactor: 1, visible: true },
  { id: 'layer_foreground', name: 'Tiền cảnh', depth: 5, cameraFactor: 1.12, visible: true },
];

export const SCENE_LAYOUT = [
  { id: 'hero', label: 'Trang chủ', shortLabel: 'Nhà', timeLabel: 'Bình minh', progressStart: 0, progressEnd: 0.18, holdStart: 0, holdEnd: 0.1, renderStart: 0, renderEnd: 0.22, anchor: { x: 0, y: 180 }, panelSide: 'left', artSide: 'right', safeZone: { x: 0, width: 0.44 } },
  { id: 'about', label: 'Về mình', shortLabel: 'Mình', timeLabel: 'Buổi sáng', progressStart: 0.14, progressEnd: 0.36, holdStart: 0.18, holdEnd: 0.28, renderStart: 0.12, renderEnd: 0.4, anchor: { x: 220, y: 540 }, panelSide: 'right', artSide: 'left', safeZone: { x: 0.56, width: 0.44 } },
  { id: 'projects', label: 'Dự án', shortLabel: 'Dự án', timeLabel: 'Giữa trưa', progressStart: 0.32, progressEnd: 0.54, holdStart: 0.36, holdEnd: 0.46, renderStart: 0.3, renderEnd: 0.58, anchor: { x: -60, y: 900 }, panelSide: 'left', artSide: 'right', safeZone: { x: 0, width: 0.46 } },
  { id: 'technology', label: 'Công nghệ', shortLabel: 'Tech', timeLabel: 'Buổi chiều', progressStart: 0.5, progressEnd: 0.72, holdStart: 0.54, holdEnd: 0.64, renderStart: 0.48, renderEnd: 0.76, anchor: { x: 200, y: 1260 }, panelSide: 'right', artSide: 'left', safeZone: { x: 0.54, width: 0.46 } },
  { id: 'playground', label: 'Playground', shortLabel: 'Chơi', timeLabel: 'Hoàng hôn', progressStart: 0.68, progressEnd: 0.9, holdStart: 0.72, holdEnd: 0.82, renderStart: 0.66, renderEnd: 0.94, anchor: { x: -40, y: 1620 }, panelSide: 'left', artSide: 'right', safeZone: { x: 0, width: 0.46 } },
  { id: 'contact', label: 'Liên hệ', shortLabel: 'Liên hệ', timeLabel: 'Ban đêm', progressStart: 0.86, progressEnd: 1, holdStart: 0.9, holdEnd: 1, renderStart: 0.84, renderEnd: 1, anchor: { x: 160, y: 1980 }, panelSide: 'right', artSide: 'left', safeZone: { x: 0.54, width: 0.46 } },
];

export const SCENE_BY_ID = Object.fromEntries(SCENE_LAYOUT.map((scene) => [scene.id, scene]));

export const SCENE_MANIFEST = Object.fromEntries(SCENE_LAYOUT.map((scene) => [scene.id, {
  ...scene,
  name: `${scene.label} · ${scene.timeLabel}`,
  worldBounds: { x: scene.anchor.x - 480, y: scene.anchor.y - 260, width: 960, height: 520 },
  layers: LAYERS,
}]));

export function getSceneFocusProgress(id) {
  const scene = SCENE_BY_ID[id];
  return scene ? (scene.holdStart + scene.holdEnd) / 2 : 0;
}

export function getActiveSceneId(progress) {
  let nearest = SCENE_LAYOUT[0];
  let distance = Infinity;
  for (const scene of SCENE_LAYOUT) {
    const nextDistance = Math.abs(progress - getSceneFocusProgress(scene.id));
    if (nextDistance < distance) { distance = nextDistance; nearest = scene; }
  }
  return nearest.id;
}

export function getSceneVisibility(id, progress) {
  const scene = SCENE_BY_ID[id];
  if (!scene || progress < scene.progressStart || progress > scene.progressEnd) return 0;
  const fade = 0.035;
  const fadeIn = scene.progressStart === 0 ? 1 : Math.min(1, (progress - scene.progressStart) / fade);
  const fadeOut = scene.progressEnd === 1 ? 1 : Math.min(1, (scene.progressEnd - progress) / fade);
  return Math.max(0, Math.min(fadeIn, fadeOut, 1));
}

export function scrollToScene(id, behavior = 'smooth') {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  window.scrollTo({ top: Math.round(maxScroll * getSceneFocusProgress(id)), behavior });
}
