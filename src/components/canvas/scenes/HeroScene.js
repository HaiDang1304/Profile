import { SCENE_MANIFEST } from '../data/sceneManifest';
import { heroComposition } from '../compositions/heroComposition';
import { parseSceneObjects } from '../composition/SceneObjectParser';

export class HeroScene {
  constructor() {
    this.manifest = SCENE_MANIFEST.hero;
    this.composition = heroComposition;
  }

  getLayerObjects(time = 0, reducedMotion = false, progress = 0) {
    return parseSceneObjects(this.composition, time, reducedMotion, progress, this.manifest);
  }
}
