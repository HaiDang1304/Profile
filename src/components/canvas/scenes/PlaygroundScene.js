import { SCENE_MANIFEST } from '../data/sceneManifest';
import { playgroundComposition } from '../compositions/playgroundComposition';
import { parseSceneObjects } from '../composition/SceneObjectParser';

export class PlaygroundScene {
  constructor() {
    this.manifest = SCENE_MANIFEST.playground;
    this.composition = playgroundComposition;
  }

  getLayerObjects(time = 0, reducedMotion = false, progress = 0) {
    return parseSceneObjects(this.composition, time, reducedMotion, progress, this.manifest);
  }
}
