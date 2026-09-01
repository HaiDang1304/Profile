import { SCENE_MANIFEST } from '../data/sceneManifest';
import { technologyComposition } from '../compositions/technologyComposition';
import { parseSceneObjects } from '../composition/SceneObjectParser';

export class TechnologyScene {
  constructor() {
    this.manifest = SCENE_MANIFEST.technology;
    this.composition = technologyComposition;
  }

  getLayerObjects(time = 0, reducedMotion = false, progress = 0) {
    return parseSceneObjects(this.composition, time, reducedMotion, progress, this.manifest);
  }
}
