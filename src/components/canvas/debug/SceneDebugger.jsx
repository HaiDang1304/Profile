import { useEffect, useRef, useState } from 'react';
import { initScrollBridge, scrollBridge } from '../core/ScrollBridge';
import { EngineLoop } from '../core/EngineLoop';
import { SCENE_MANIFEST } from '../data/sceneManifest';
import { viewportTransform } from '../core/ViewportTransform';

export default function SceneDebugger() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [selectedScene, setSelectedScene] = useState('contact');
  const [cameraStats, setCameraStats] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [sceneStats, setSceneStats] = useState({ totalObjects: 0, renderedObjects: 0, culledObjects: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fps, setFps] = useState(60);

  const [layers, setLayers] = useState({
    layer_far_sky: true,
    layer_far_landscape: true,
    layer_mid_ground: true,
    layer_main_world: true,
    layer_foreground: true,
  });

  const [showAnchors, setShowAnchors] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sceneName = params.get('name');
    const toScene = params.get('to');
    if (sceneName === 'hero') {
      setSelectedScene('hero');
    } else if (sceneName === 'about' || toScene === 'about') {
      setSelectedScene('about');
    } else if (sceneName === 'projects' || toScene === 'projects') {
      setSelectedScene('projects');
    } else if (sceneName === 'playground' || toScene === 'playground') {
      setSelectedScene('playground');
    } else if (sceneName === 'contact' || toScene === 'contact') {
      setSelectedScene('contact');
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;

      viewportTransform.resize({
        viewportWidth: vw,
        viewportHeight: vh,
        devicePixelRatio: dpr,
      });
    };
    updateSize();

    const cleanupScroll = initScrollBridge();
    const engine = new EngineLoop(canvas, { renderMode: 'scene' });
    engineRef.current = engine;
    engine.start();

    const statsTimer = setInterval(() => {
      if (engine.camera) {
        const pos = engine.camera.getRenderPosition();
        setCameraStats({
          x: pos.x,
          y: pos.y,
          targetX: Math.round(pos.targetX),
          targetY: Math.round(pos.targetY),
        });
      }
      if (engine.sceneManager) {
        setSceneStats(engine.sceneManager.getStats());
      }
      setScrollProgress(scrollBridge.current);
      setFps(engine.currentFps);
    }, 100);

    const handleResize = () => {
      updateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(statsTimer);
      engine.stop();
      cleanupScroll();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleLayer = (layerId) => {
    const nextState = !layers[layerId];
    setLayers((prev) => ({ ...prev, [layerId]: nextState }));
    if (engineRef.current?.sceneManager?.compositor) {
      engineRef.current.sceneManager.compositor.setLayerVisibility(layerId, nextState);
    }
  };

  const toggleAnchors = () => {
    const next = !showAnchors;
    setShowAnchors(next);
    if (engineRef.current?.sceneManager?.compositor) {
      engineRef.current.sceneManager.compositor.setAnchorVisibility(next);
    }
  };

  const manifest = SCENE_MANIFEST[selectedScene] || SCENE_MANIFEST.contact;

  // Active scene & transition overlap checks
  const isHeroRendering = scrollProgress >= SCENE_MANIFEST.hero.renderStart && scrollProgress <= SCENE_MANIFEST.hero.renderEnd;
  const isAboutRendering = scrollProgress >= SCENE_MANIFEST.about.renderStart && scrollProgress <= SCENE_MANIFEST.about.renderEnd;
  const isProjectsRendering = scrollProgress >= SCENE_MANIFEST.projects.renderStart && scrollProgress <= SCENE_MANIFEST.projects.renderEnd;
  const isPlaygroundRendering = scrollProgress >= SCENE_MANIFEST.playground.renderStart && scrollProgress <= SCENE_MANIFEST.playground.renderEnd;
  const isContactRendering = scrollProgress >= SCENE_MANIFEST.contact.renderStart && scrollProgress <= SCENE_MANIFEST.contact.renderEnd;

  const isTransitionHeroAbout = scrollProgress >= 0.16 && scrollProgress <= 0.28;
  const isTransitionAboutProjects = scrollProgress >= 0.40 && scrollProgress <= 0.52;
  const isTransitionProjectsPlayground = scrollProgress >= 0.65 && scrollProgress <= 0.77;
  const isTransitionPlaygroundContact = scrollProgress >= 0.80 && scrollProgress <= 0.90;

  return (
    <div className="relative min-h-[500svh] bg-slate-950 font-mono text-xs">
      {/* Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Diagnostic Floating Panel */}
      <div className="fixed top-4 left-4 z-50 p-4 bg-slate-900/95 border-2 border-amber-500 rounded-lg shadow-2xl max-w-sm text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <h1 className="font-bold text-amber-400 text-sm">SCENE & TRANSITION DEBUGGER</h1>
          <a href="/" className="text-slate-400 hover:text-white underline text-[11px]">
            ← Clean Portfolio
          </a>
        </div>

        {/* Scene Selector (5 Scenes) */}
        <div className="grid grid-cols-5 gap-1 mb-3">
          {['hero', 'about', 'projects', 'playground', 'contact'].map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedScene(sc)}
              className={`py-1.5 rounded font-bold capitalize text-[9px] transition-colors ${
                selectedScene === sc ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Real-time Telemetry */}
        <div className="space-y-1.5 mb-3 text-[11px] text-slate-300">
          <p>
            <span className="text-slate-400">Scroll Progress:</span>{' '}
            <span className="font-bold text-yellow-400">{(scrollProgress * 100).toFixed(1)}%</span>
            {scrollProgress >= 0.999 && (
              <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-slate-950 rounded font-bold text-[9px]">
                100% END REACHED
              </span>
            )}
          </p>
          <p>
            <span className="text-slate-400">Camera Coords:</span>{' '}
            <span className="font-bold text-white">X={cameraStats.x}, Y={cameraStats.y}</span>
          </p>
          <p>
            <span className="text-slate-400">Camera Target:</span>{' '}
            <span className="font-bold text-sky-300">X={cameraStats.targetX}, Y={cameraStats.targetY}</span>
          </p>
          <p>
            <span className="text-slate-400">Reference FPS:</span>{' '}
            <span className="font-bold text-green-400">{fps} FPS</span>
          </p>
        </div>

        {/* Multi-Scene Continuous Transition Monitor */}
        <div className="p-2.5 bg-slate-800/90 rounded border border-slate-700 mb-3 text-[11px]">
          <h2 className="font-bold text-sky-400 text-[11px] mb-1.5 uppercase">🔄 Active Render Pipeline</h2>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span>Hero (0-20%):</span>
              <span className={isHeroRendering ? 'text-green-400 font-bold' : 'text-slate-500'}>
                {isHeroRendering ? 'RENDERING' : 'IDLE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>About (20-45%):</span>
              <span className={isAboutRendering ? 'text-green-400 font-bold' : 'text-slate-500'}>
                {isAboutRendering ? 'RENDERING' : 'IDLE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Projects (45-70%):</span>
              <span className={isProjectsRendering ? 'text-green-400 font-bold' : 'text-slate-500'}>
                {isProjectsRendering ? 'RENDERING' : 'IDLE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Playground (70-85%):</span>
              <span className={isPlaygroundRendering ? 'text-green-400 font-bold' : 'text-slate-500'}>
                {isPlaygroundRendering ? 'RENDERING' : 'IDLE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Contact (85-100%):</span>
              <span className={isContactRendering ? 'text-green-400 font-bold' : 'text-slate-500'}>
                {isContactRendering ? 'RENDERING' : 'IDLE'}
              </span>
            </div>
            {(isTransitionHeroAbout || isTransitionAboutProjects || isTransitionProjectsPlayground || isTransitionPlaygroundContact) && (
              <div className="mt-1 pt-1 border-t border-slate-700 text-amber-300 font-bold animate-pulse">
                Overlap: {isTransitionHeroAbout ? 'Hero → About' : isTransitionAboutProjects ? 'About → Projects' : isTransitionProjectsPlayground ? 'Projects → Playground' : 'Playground → Contact (80-90%)'}
              </div>
            )}
          </div>
        </div>

        {/* Object Culling Statistics */}
        <div className="p-2.5 bg-slate-800/90 rounded border border-slate-700 mb-3 text-[11px]">
          <h2 className="font-bold text-yellow-400 text-[11px] mb-1.5 uppercase">🎯 Viewport Object Culling</h2>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="p-1 bg-slate-900 rounded">
              <span className="text-[10px] text-slate-400 block">Total</span>
              <span className="font-bold text-white">{sceneStats.totalObjects}</span>
            </div>
            <div className="p-1 bg-slate-900 rounded">
              <span className="text-[10px] text-green-400 block">Rendered</span>
              <span className="font-bold text-green-300">{sceneStats.renderedObjects}</span>
            </div>
            <div className="p-1 bg-slate-900 rounded">
              <span className="text-[10px] text-red-400 block">Culled</span>
              <span className="font-bold text-red-300">{sceneStats.culledObjects}</span>
            </div>
          </div>
        </div>

        {/* Layer Visibility Controls */}
        <div className="mb-3">
          <h2 className="font-bold text-amber-300 text-[11px] mb-1.5 uppercase">👁️ Layer Controls ({manifest.id})</h2>
          <div className="space-y-1">
            {manifest.layers.map((layer) => {
              const isOn = layers[layer.id];
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors ${
                    isOn ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <span className="text-[10px]">{layer.name} ({layer.cameraFactor}x)</span>
                  <span className="font-bold text-[9px]">{isOn ? 'ON' : 'OFF'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Anchor Point Toggle */}
        <button
          onClick={toggleAnchors}
          className={`w-full py-1.5 rounded font-bold border transition-colors ${
            showAnchors ? 'bg-red-600/30 text-red-200 border-red-500' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {showAnchors ? 'Hide Anchor Points' : 'Show Sprite Anchor Points'}
        </button>
      </div>

      {/* Scroll Spacing to test transition through 0% to 100% */}
      <div className="relative z-10 pointer-events-none">
        <div className="h-[100svh] flex items-center justify-end p-8 text-right text-slate-500">
          Hero (0-20%) ↓
        </div>
        <div className="h-[125svh] flex items-center justify-end p-8 text-right text-slate-500">
          About (20-45%) ↓
        </div>
        <div className="h-[125svh] flex items-center justify-end p-8 text-right text-slate-500">
          Projects (45-70%) ↓
        </div>
        <div className="h-[75svh] flex items-center justify-end p-8 text-right text-slate-500">
          Playground (70-85%) ↓
        </div>
        <div className="h-[75svh] flex items-center justify-end p-8 text-right text-slate-500">
          Contact (85-100%) - Sông Đêm & Bếp Củi
        </div>
      </div>
    </div>
  );
}
