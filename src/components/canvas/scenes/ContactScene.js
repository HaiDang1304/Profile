import { SCENE_MANIFEST } from '../data/sceneManifest';
import { contactComposition } from '../compositions/contactComposition';
import { parseSceneObjects } from '../composition/SceneObjectParser';

export class ContactScene {
  constructor() {
    this.manifest = SCENE_MANIFEST.contact;
    this.composition = contactComposition;
  }

  getLayerObjects(time = 0, reducedMotion = false, progress = 0) {
    return parseSceneObjects(this.composition, time, reducedMotion, progress, this.manifest);
  }
}
