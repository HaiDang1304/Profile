import { SCENE_MANIFEST } from '../data/sceneManifest';
import { projectsComposition } from '../compositions/projectsComposition';
import { parseSceneObjects } from '../composition/SceneObjectParser';

export class ProjectsScene {
  constructor() {
    this.manifest = SCENE_MANIFEST.projects;
    this.composition = projectsComposition;
  }

  getLayerObjects(time = 0, reducedMotion = false, progress = 0) {
    return parseSceneObjects(this.composition, time, reducedMotion, progress, this.manifest);
  }
}
