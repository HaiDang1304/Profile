import { SCENE_BACKDROP_BY_ID } from '../canvas/data/sceneBackdrops';

export default function SceneInteractionButton({ sceneId }) {
  const scene = SCENE_BACKDROP_BY_ID[sceneId];
  if (!scene) return null;

  const triggerScene = () => {
    window.dispatchEvent(new CustomEvent('portfolio:interact', {
      detail: { sceneId },
    }));
  };

  return (
    <button
      type="button"
      className="scene-interaction"
      onClick={triggerScene}
      title={scene.interactionHint}
      aria-label={`${scene.interactionLabel}. ${scene.interactionHint}`}
    >
      <span className="scene-interaction__icon" aria-hidden="true">✦</span>
      <span>
        <strong>{scene.interactionLabel}</strong>
        <small>{scene.interactionHint}</small>
      </span>
      <span className="scene-interaction__key" aria-hidden="true">CLICK</span>
    </button>
  );
}
