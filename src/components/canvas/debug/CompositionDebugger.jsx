import { useEffect, useRef, useState } from 'react';
import { initScrollBridge, scrollBridge } from '../core/ScrollBridge';
import { EngineLoop } from '../core/EngineLoop';
import { viewportTransform } from '../core/ViewportTransform';
import { heroComposition } from '../compositions/heroComposition';
import { aboutComposition } from '../compositions/aboutComposition';
import { projectsComposition } from '../compositions/projectsComposition';
import { contactComposition } from '../compositions/contactComposition';
import { sceneChunkCache } from '../composition/SceneChunkCache';

export default function CompositionDebugger() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [sceneTarget, setSceneTarget] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const [fps, setFps] = useState(60);
  const [showClusters] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scene = params.get('scene');
    if (scene === 'contact') {
      setSceneTarget('contact');
    } else if (scene === 'projects') {
      setSceneTarget('projects');
    } else if (scene === 'about') {
      setSceneTarget('about');
    } else {
      setSceneTarget('hero');
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
        setCameraPos({ x: Math.round(pos.x), y: Math.round(pos.y) });
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

  const composition = sceneTarget === 'contact' ? contactComposition : sceneTarget === 'projects' ? projectsComposition : sceneTarget === 'about' ? aboutComposition : heroComposition;
  const chunkStats = sceneChunkCache.getStats();
  const clusters = Object.entries(composition.clusters);

  return (
    <div className="relative min-h-[500svh] bg-slate-950 font-mono text-xs select-none">
      {/* Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Floating Diagnostic Dashboard */}
      <div className="fixed top-4 left-4 z-50 p-4 bg-slate-900/95 border-2 border-amber-500 rounded-lg shadow-2xl max-w-sm text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <h1 className="font-bold text-amber-400 text-sm">
            {sceneTarget.toUpperCase()} COMPOSITION DEBUGGER
          </h1>
          <a href="/" className="text-slate-400 hover:text-white underline text-[11px]">
            ← Portfolio
          </a>
        </div>

        {/* Real-time Telemetry */}
        <div className="space-y-1 mb-3 text-[11px] bg-slate-800/80 p-2.5 rounded border border-slate-700">
          <p className="flex justify-between">
            <span className="text-slate-400">Target Scene:</span>
            <span className="font-bold text-emerald-300">{composition.name}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Scroll Progress:</span>
            <span className="font-bold text-yellow-400">{(scrollProgress * 100).toFixed(1)}%</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Camera Coords:</span>
            <span className="font-bold text-white">X={cameraPos.x}, Y={cameraPos.y}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">FPS / Static Chunks:</span>
            <span className="font-bold text-green-400">{fps} FPS / {chunkStats.cachedChunkCount}</span>
          </p>
        </div>

        {/* Landmarks Status */}
        <div className="mb-3 p-2 bg-slate-800/80 rounded border border-slate-700 text-[11px]">
          <h2 className="font-bold text-amber-300 mb-1.5 uppercase">🏛️ Primary Landmarks</h2>
          <div className="space-y-1">
            {composition.landmarks.map((lm) => (
              <div key={lm.id} className="flex justify-between text-[10px]">
                <span className="text-slate-300">{lm.name}</span>
                <span className="font-mono text-amber-400">X={lm.x}, Y={lm.y}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scene Clusters */}
        <div className="mb-3 space-y-1">
          <h2 className="font-bold text-amber-300 text-[11px] uppercase">🌿 Clustered Scene Groups</h2>
          {clusters.map(([key, cluster]) => (
            <div key={key} className="p-1.5 bg-slate-800/60 rounded border border-slate-700 text-[10px] flex justify-between">
              <span>{cluster.name}</span>
              <span className="text-emerald-300">{cluster.objects.length} items</span>
            </div>
          ))}
        </div>

        {/* Scene Selector Buttons */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          <a
            href="?debug=composition&scene=hero"
            className={`py-1.5 px-1 rounded font-bold border text-center text-[10px] ${
              sceneTarget === 'hero' ? 'bg-amber-600/30 text-amber-200 border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Hero
          </a>
          <a
            href="?debug=composition&scene=about"
            className={`py-1.5 px-1 rounded font-bold border text-center text-[10px] ${
              sceneTarget === 'about' ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            About
          </a>
          <a
            href="?debug=composition&scene=projects"
            className={`py-1.5 px-1 rounded font-bold border text-center text-[10px] ${
              sceneTarget === 'projects' ? 'bg-orange-600/30 text-orange-200 border-orange-500' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Proj
          </a>
          <a
            href="?debug=composition&scene=contact"
            className={`py-1.5 px-1 rounded font-bold border text-center text-[10px] ${
              sceneTarget === 'contact' ? 'bg-purple-600/30 text-purple-200 border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Contact
          </a>
        </div>
      </div>

      {/* Visual Overlay for Clusters when enabled */}
      {showClusters && (
        <div className="fixed bottom-4 right-4 z-40 p-3 bg-slate-900/90 border border-amber-500/60 rounded max-w-xs text-[10px] space-y-1 text-slate-300">
          <p className="font-bold text-amber-300">{composition.name} Clusters:</p>
          {clusters.map(([key, cluster]) => (
            <p key={key}>• {cluster.name}: {cluster.objects.length} items</p>
          ))}
        </div>
      )}
    </div>
  );
}
