import { scrollBridge } from './ScrollBridge';
import { Camera2D } from './Camera2D';
import { SceneManager } from '../systems/SceneManager';
import { DebugWorldRenderer } from '../systems/DebugWorldRenderer';
import { viewportTransform } from './ViewportTransform';
import { updateWorldAnchors } from './WorldAnchorRegistry';
import { getActiveSceneId } from '../data/sceneLayout';

export let activeCamera = null;

export class EngineLoop {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.camera = new Camera2D();
    activeCamera = this.camera;
    this.sceneManager = new SceneManager();
    this.debugRenderer = new DebugWorldRenderer();

    this.renderMode = options.renderMode || 'scene'; // 'scene' | 'debug_world'
    this.isRunning = false;
    this.rafId = null;
    this.lastTime = 0;

    // Reduced motion media query
    this.reducedMotion = false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = this.motionQuery.matches;
      this.handleMotionPreference = (e) => {
        this.reducedMotion = e.matches;
        this.camera.setReducedMotion(this.reducedMotion);
        this.camera.damping = this.reducedMotion ? 20.0 : 8.0;
      };
      this.motionQuery.addEventListener('change', this.handleMotionPreference);
      if (this.reducedMotion) {
        this.camera.damping = 20.0;
        this.camera.setReducedMotion(true);
      }
    }

    // Reference FPS calculation
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.currentFps = 60;
    this.activeSceneId = null;

    // Page Visibility handling
    this.handleVisibilityChange = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };

    this.handlePointerMove = (event) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      this.sceneManager.setPointer(x, y);
    };
    this.handlePointerLeave = () => this.sceneManager.setPointer(0, 0);
    this.handleSceneInteraction = (event) => {
      if (event.detail?.sceneId) this.sceneManager.triggerInteraction(event.detail.sceneId);
    };

    this.loop = this.loop.bind(this);
  }

  setRenderMode(mode) {
    this.renderMode = mode;
  }

  renderFrame(now, dt = 0.016) {
    if (!this.ctx || !this.canvas) return;

    viewportTransform.applyScreenSpace(this.ctx);
    const viewport = viewportTransform.getViewportSize();
    this.ctx.clearRect(0, 0, viewport.width, viewport.height);

    const renderPos = this.camera.getRenderPosition();
    const timeInSeconds = now * 0.001;

    if (this.renderMode === 'debug_world') {
      viewportTransform.applyScreenSpace(this.ctx);
      const vp = viewportTransform.getViewportSize();
      this.debugRenderer.render(this.ctx, renderPos, vp.width, vp.height, scrollBridge.current, this.currentFps);
    } else {
      this.sceneManager.render(this.ctx, {
        cameraPos: renderPos,
        scrollProgress: scrollBridge.current,
        time: timeInSeconds,
        dt,
        reducedMotion: this.reducedMotion,
        fps: this.currentFps,
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.lastFpsUpdate = this.lastTime;
    this.frameCount = 0;

    // Snap to initial scroll position immediately
    this.camera.snapTo(scrollBridge.target);
    scrollBridge.current = scrollBridge.target;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', this.handlePointerLeave);
    window.addEventListener('portfolio:interact', this.handleSceneInteraction);

    this.scheduleFrame();
  }

  scheduleFrame() {
    this.rafId = requestAnimationFrame(this.loop);
  }

  loop(now) {
    if (!this.isRunning) return;
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    this.frameCount++;
    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    const scrollAlpha = this.reducedMotion ? 1 : 1 - Math.exp(-12 * dt);
    scrollBridge.current += (scrollBridge.target - scrollBridge.current) * scrollAlpha;
    this.camera.updateTarget(scrollBridge.current);
    this.camera.tick(dt);
    updateWorldAnchors(this.camera.getRenderPosition(), scrollBridge.current, this.reducedMotion);

    const nextSceneId = getActiveSceneId(scrollBridge.current);
    if (nextSceneId !== this.activeSceneId) {
      this.activeSceneId = nextSceneId;
      window.dispatchEvent(new CustomEvent('portfolio:scenechange', { detail: { sceneId: nextSceneId } }));
    }
    this.renderFrame(now, dt);
    
    this.scheduleFrame();
  }

  pause() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (this.isRunning && !this.rafId) {
      this.lastTime = performance.now();
      this.scheduleFrame();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pointermove', this.handlePointerMove);
    document.documentElement.removeEventListener('pointerleave', this.handlePointerLeave);
    window.removeEventListener('portfolio:interact', this.handleSceneInteraction);
    this.motionQuery?.removeEventListener('change', this.handleMotionPreference);
    this.sceneManager.dispose();
  }
}
