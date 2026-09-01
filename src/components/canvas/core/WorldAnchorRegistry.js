import { viewportTransform } from './ViewportTransform';
import { getSceneVisibility } from '../data/sceneLayout';

const anchors = new Set();

export function registerWorldAnchor(entry) {
  anchors.add(entry);
  return () => anchors.delete(entry);
}

export function updateWorldAnchors(cameraPos, progress, reducedMotion = false) {
  for (const entry of anchors) {
    const worldX = reducedMotion ? entry.wx * 0.22 : entry.wx;
    const screen = viewportTransform.worldToScreen(worldX, entry.wy, cameraPos, entry.parallaxFactor);
    const viewport = viewportTransform.getViewportSize();
    const horizontalDistance = Math.abs(screen.x - viewport.width / 2) / Math.max(viewport.width * 0.42, 1);
    const verticalDistance = Math.abs(screen.y - viewport.height / 2) / Math.max(viewport.height * 0.34, 1);
    const spatialVisibility = Math.max(0, 1 - Math.max(horizontalDistance, verticalDistance));
    const spatialGate = spatialVisibility < 0.58 ? 0 : (spatialVisibility - 0.58) / 0.42;
    const visibility = getSceneVisibility(entry.sceneId, progress) * spatialGate;
    entry.element.style.transform = `translate3d(calc(${screen.x}px - 50vw), calc(${screen.y}px - 50vh), 0)`;
    entry.element.style.opacity = String(visibility);

    const isInteractive = visibility > 0.45;
    if (entry.isInteractive !== isInteractive) {
      entry.isInteractive = isInteractive;
      entry.element.inert = !isInteractive;
      entry.element.setAttribute('aria-hidden', String(!isInteractive));
    }
  }
}
