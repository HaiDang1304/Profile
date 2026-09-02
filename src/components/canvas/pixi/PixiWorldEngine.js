import { Application } from 'pixi.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tiledWorld from './maps/portfolio-world.json';
import { buildTiledWorld } from './world/TiledWorldBuilder';
import { sampleCameraPath } from '../data/cameraPath';
import { getActiveSceneId, getSceneVisibility } from '../data/sceneLayout';
import { viewportTransform } from '../core/ViewportTransform';
import { updateWorldAnchors } from '../core/WorldAnchorRegistry';

gsap.registerPlugin(ScrollTrigger);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smootherstep(value) {
  const x = clamp(value, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export class PixiWorldEngine {
  constructor(host) {
    this.host = host;
    this.app = null;
    this.world = null;
    this.progress = 0;
    this.time = 0;
    this.activeSceneId = null;
    this.interactions = new Map();
    this.pointer = { x: 0, y: 0 };
    this.pointerTarget = { x: 0, y: 0 };
    this.reducedMotion = false;
    this.destroyed = false;
    this.scrollTween = null;
    this.motionQuery = null;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onSceneInteraction = this.onSceneInteraction.bind(this);
    this.onResize = this.onResize.bind(this);
    this.tick = this.tick.bind(this);
  }

  async init() {
    const app = new Application();
    await app.init({
      resizeTo: window,
      preference: 'webgl',
      antialias: false,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      backgroundColor: '#071323',
      backgroundAlpha: 1,
      powerPreference: 'high-performance',
    });

    if (this.destroyed) {
      app.destroy({ removeView: true }, { children: true });
      return;
    }

    this.app = app;
    app.canvas.className = 'pixi-world-canvas';
    app.canvas.setAttribute('aria-hidden', 'true');
    app.canvas.style.imageRendering = 'pixelated';
    this.host.appendChild(app.canvas);
    this.host.dataset.rendererState = 'ready';

    this.world = buildTiledWorld(tiledWorld);
    app.stage.addChild(this.world.root);
    app.stage.eventMode = 'none';

    this.motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
    this.reducedMotion = Boolean(this.motionQuery?.matches);
    this.onMotionPreference = (event) => {
      this.reducedMotion = event.matches;
      this.createScrollDirector();
    };
    this.motionQuery?.addEventListener('change', this.onMotionPreference);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
    window.addEventListener('portfolio:interact', this.onSceneInteraction);
    window.addEventListener('resize', this.onResize, { passive: true });

    this.onResize();
    this.createScrollDirector();
    app.ticker.add(this.tick);
    this.setProgress(this.getNativeProgress());
  }

  getNativeProgress() {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return clamp(window.scrollY / maxScroll, 0, 1);
  }

  createScrollDirector() {
    this.scrollTween?.scrollTrigger?.kill();
    this.scrollTween?.kill();

    const playhead = { progress: this.getNativeProgress() };
    this.scrollTween = gsap.fromTo(
      playhead,
      { progress: 0 },
      {
        progress: 1,
        ease: 'none',
        onUpdate: () => this.setProgress(playhead.progress),
        scrollTrigger: {
          id: 'pixi-world-camera',
          trigger: document.documentElement,
          start: 'top top',
          end: 'max',
          scrub: this.reducedMotion ? false : 0.55,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      },
    );
    ScrollTrigger.refresh();
  }

  setProgress(progress) {
    this.progress = clamp(progress, 0, 1);
    const sceneId = getActiveSceneId(this.progress);
    if (sceneId !== this.activeSceneId) {
      this.activeSceneId = sceneId;
      window.dispatchEvent(new CustomEvent('portfolio:scenechange', { detail: { sceneId } }));
    }
  }

  onResize() {
    viewportTransform.resize({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    });
    ScrollTrigger.refresh(true);
  }

  onPointerMove(event) {
    this.pointerTarget.x = clamp((event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2, -1, 1);
    this.pointerTarget.y = clamp((event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2, -1, 1);
  }

  onPointerLeave() {
    this.pointerTarget.x = 0;
    this.pointerTarget.y = 0;
  }

  onSceneInteraction(event) {
    if (event.detail?.sceneId) this.interactions.set(event.detail.sceneId, this.time);
  }

  getInteractionEnergy(sceneId) {
    const startedAt = this.interactions.get(sceneId);
    if (startedAt === undefined) return 0;
    const duration = this.reducedMotion ? 0.45 : 3.2;
    const remaining = 1 - (this.time - startedAt) / duration;
    if (remaining <= 0) {
      this.interactions.delete(sceneId);
      return 0;
    }
    return smootherstep(remaining);
  }

  updateScene(scene, camera, deltaSeconds) {
    const visibility = getSceneVisibility(scene.id, this.progress);
    scene.view.visible = visibility > 0.002;
    scene.view.alpha = visibility;
    if (!scene.view.visible) return;

    const relativeX = camera.x - scene.anchor.x;
    const relativeY = camera.y - scene.anchor.y;
    const parallax = [
      [scene.layers.farSky, 0.08],
      [scene.layers.farLandscape, 0.28],
      [scene.layers.midGround, 0.62],
      [scene.layers.mainWorld, 1],
      [scene.layers.foreground, 1.06],
    ];
    for (const [layer, factor] of parallax) {
      layer.position.set(relativeX * (1 - factor), relativeY * (1 - factor));
    }

    const energy = this.getInteractionEnergy(scene.id);
    for (const cloud of scene.clouds) {
      const travel = this.reducedMotion ? 0 : (this.time * cloud.speed * (1 + energy * 0.35)) % 1320;
      cloud.view.x = cloud.startX + travel;
      if (cloud.view.x > 650) cloud.view.x -= 1320;
      cloud.view.y += this.reducedMotion ? 0 : Math.sin(this.time * 0.35 + cloud.speed) * 0.01;
    }
    for (const ripple of scene.ripples) {
      ripple.view.x = ripple.originX + (this.reducedMotion ? 0 : Math.sin(this.time * 0.9 + ripple.speed) * (6 + energy * 4));
    }
    for (const update of scene.updates) update(this.time, deltaSeconds, energy, this.reducedMotion);
  }

  tick(ticker) {
    if (!this.app || !this.world || this.destroyed) return;
    const deltaSeconds = Math.min(ticker.deltaMS / 1000, 0.05);
    this.time += deltaSeconds;
    const smoothing = this.reducedMotion ? 1 : 1 - Math.exp(-9 * deltaSeconds);
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * smoothing;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * smoothing;

    const camera = sampleCameraPath(this.progress, this.reducedMotion);
    const scale = viewportTransform.getScale();
    const offset = viewportTransform.getOffset();
    const virtual = viewportTransform.getVirtualSize();
    const pointerX = this.reducedMotion ? 0 : this.pointer.x * 3;
    const pointerY = this.reducedMotion ? 0 : this.pointer.y * 2;
    this.world.root.scale.set(scale);
    this.world.root.position.set(
      Math.round(offset.x + virtual.width * scale * 0.5 - camera.x * scale + pointerX),
      Math.round(offset.y + virtual.height * scale * 0.5 - camera.y * scale + pointerY),
    );

    for (const scene of this.world.scenes.values()) this.updateScene(scene, camera, deltaSeconds);
    updateWorldAnchors(camera, this.progress, this.reducedMotion);
  }

  destroy() {
    this.destroyed = true;
    this.scrollTween?.scrollTrigger?.kill();
    this.scrollTween?.kill();
    window.removeEventListener('pointermove', this.onPointerMove);
    document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('portfolio:interact', this.onSceneInteraction);
    window.removeEventListener('resize', this.onResize);
    this.motionQuery?.removeEventListener('change', this.onMotionPreference);
    if (this.app) {
      this.app.ticker.remove(this.tick);
      this.app.destroy({ removeView: true }, { children: true });
      this.app = null;
    }
    this.world = null;
  }
}
