import { SCENE_MANIFEST } from '../data/sceneManifest';
import { aboutComposition } from '../compositions/aboutComposition';
import { parseSceneObjects } from '../composition/SceneObjectParser';

export class AboutScene {
  constructor() {
    this.manifest = SCENE_MANIFEST.about;
    this.composition = aboutComposition;
  }

  getLayerObjects(time = 0, reducedMotion = false, progress = 0) {
    return parseSceneObjects(this.composition, time, reducedMotion, progress, this.manifest);
  }
}
