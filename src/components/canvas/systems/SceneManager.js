import { ParallaxCompositor } from './ParallaxCompositor';
import { HeroScene } from '../scenes/HeroScene';
import { AboutScene } from '../scenes/AboutScene';
import { ProjectsScene } from '../scenes/ProjectsScene';
import { TechnologyScene } from '../scenes/TechnologyScene';
import { PlaygroundScene } from '../scenes/PlaygroundScene';
import { ContactScene } from '../scenes/ContactScene';
import { WorldBaseLayer } from '../world/WorldBaseLayer';
import { TerrainStrip } from '../world/TerrainStrip';
import { WorldPaletteTrack } from '../world/WorldPaletteTrack';
import { TransitionCorridor } from '../world/TransitionCorridor';
import { registerAllSprites } from '../data/spriteManifest';
import { viewportTransform } from '../core/ViewportTransform';
import { WorldArtRenderer } from '../world/WorldArtRenderer';
import { AtmosphereSystem } from './AtmosphereSystem';
import { ProceduralBackdropRenderer } from '../world/ProceduralBackdropRenderer';
import { LivingSceneRenderer } from '../world/LivingSceneRenderer';

export class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.compositor = new ParallaxCompositor();
    this.atmosphere = new AtmosphereSystem();
    this.backdrops = new ProceduralBackdropRenderer();
    this.livingScene = new LivingSceneRenderer();
    this.initCount = 0;

    // Register all sprites into SpriteCache once
    registerAllSprites();

    // Register all six scenes in narrative order.
    this.register(new HeroScene());
    this.register(new AboutScene());
    this.register(new ProjectsScene());
    this.register(new TechnologyScene());
    this.register(new PlaygroundScene());
    this.register(new ContactScene());
    this.initCount++;
  }

  register(scene) {
    if (scene && scene.manifest && scene.manifest.id) {
      this.scenes.set(scene.manifest.id, scene);
    }
  }

  getActiveScenes(progress) {
    const active = [];
    this.scenes.forEach((scene) => {
      const rStart = scene.manifest.renderStart !== undefined ? scene.manifest.renderStart : scene.manifest.progressStart;
      const rEnd = scene.manifest.renderEnd !== undefined ? scene.manifest.renderEnd : scene.manifest.progressEnd;
      if (progress >= rStart && progress <= rEnd) {
        active.push(scene);
      }
    });

    if (active.length === 0) {
      if (progress >= 0.85 && this.scenes.has('contact')) {
        active.push(this.scenes.get('contact'));
      } else if (this.scenes.has('hero')) {
        active.push(this.scenes.get('hero'));
      }
    }
    return active;
  }

  setPointer(x, y) {
    this.backdrops.setPointer(x, y);
    this.livingScene.setPointer(x, y);
  }

  triggerInteraction(sceneId) {
    this.backdrops.trigger(sceneId);
    this.livingScene.trigger(sceneId);
  }

  render(ctx, engineState) {
    const { cameraPos, scrollProgress, time, reducedMotion } = engineState;
    this.compositor.resetStats();

    // Integer rounded camera render coordinates to prevent subpixel seam gaps
    const roundedCameraPos = {
      x: Math.round(cameraPos.x),
      y: Math.round(cameraPos.y),
    };

    // ─────────────────────────────────────────────────────────────
    // STEP 1: SINGLE CLEAR & UNIFIED WORLD BASE LAYER (100% Viewport + Continuous World)
    // ─────────────────────────────────────────────────────────────
    WorldBaseLayer.render(ctx, scrollProgress, roundedCameraPos, time);

    // Every chapter is drawn procedurally on a low-resolution pixel canvas.
    // No generated PNG/WebP backdrop participates in the render pipeline.
    const hasDetailedBackdrop = this.backdrops.render(ctx, scrollProgress, time, reducedMotion);

    // ─────────────────────────────────────────────────────────────
    // STEP 2: VIRTUAL WORLD TRANSFORM & PARALLAX COMPOSITION
    // ─────────────────────────────────────────────────────────────
    viewportTransform.applyToContext(ctx);
    const vSize = viewportTransform.getVirtualSize();

    const activeScenes = hasDetailedBackdrop ? [] : this.getActiveScenes(scrollProgress);
    const sharedCorridorObjs = hasDetailedBackdrop ? [] : TransitionCorridor.getSharedObjects(scrollProgress);

    const layerDefs = [
      { id: 'layer_far_sky', cameraFactor: 0.10 },
      { id: 'layer_far_landscape', cameraFactor: 0.25 },
      { id: 'layer_mid_ground', cameraFactor: 0.60 },
      { id: 'layer_main_world', cameraFactor: 1.00 },
      { id: 'layer_foreground', cameraFactor: 1.12 },
    ];

    for (let l = 0; l < layerDefs.length; l++) {
      const layerDef = layerDefs[l];

      // Draw organic continuous riverbank terrain on midground layer
      if (!hasDetailedBackdrop && layerDef.id === 'layer_mid_ground') {
        TerrainStrip.render(ctx, WorldPaletteTrack.sample(scrollProgress), roundedCameraPos);
      }

      const corridorLayerObjects = sharedCorridorObjs.filter((obj) => obj.layer === layerDef.id);
      this.compositor.renderLayer(
        ctx,
        layerDef,
        corridorLayerObjects,
        roundedCameraPos,
        vSize.width,
        vSize.height,
        time,
        reducedMotion
      );

      // Render active scene objects for this layer
      for (let s = 0; s < activeScenes.length; s++) {
        const scene = activeScenes[s];
        const layerObjects = scene.getLayerObjects(time, reducedMotion, scrollProgress);
        const objects = layerObjects[layerDef.id] || [];

        this.compositor.renderLayer(
          ctx,
          layerDef,
          objects,
          roundedCameraPos,
          vSize.width,
          vSize.height,
          time,
          reducedMotion
        );
      }
    }

    if (!hasDetailedBackdrop) {
      WorldArtRenderer.render(ctx, roundedCameraPos, scrollProgress, time, reducedMotion);
    } else {
      this.livingScene.render(ctx, scrollProgress, time, reducedMotion);
    }

    viewportTransform.applyToContext(ctx);
    this.atmosphere.update(engineState.dt, engineState, vSize.width, vSize.height);
    this.atmosphere.render(ctx, roundedCameraPos, vSize.width, vSize.height, scrollProgress);
  }

  getStats() {
    return {
      ...this.compositor.stats,
      initCount: this.initCount,
      atmosphere: this.atmosphere.getTelemetry(),
    };
  }

  dispose() {
    this.scenes.clear();
    this.atmosphere.dispose();
  }
}
