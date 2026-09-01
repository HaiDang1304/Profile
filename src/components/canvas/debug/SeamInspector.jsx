import { useEffect, useRef, useState } from 'react';
import { initScrollBridge, scrollBridge } from '../core/ScrollBridge';
import { EngineLoop } from '../core/EngineLoop';
import { viewportTransform } from '../core/ViewportTransform';

export default function SeamInspector() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, floatX: 0, floatY: 0 });
  const [fps, setFps] = useState(60);
  const [showOverscan, setShowOverscan] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);

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
        setCameraPos({
          x: Math.round(pos.x),
          y: Math.round(pos.y),
          floatX: pos.x.toFixed(2),
          floatY: pos.y.toFixed(2),
        });
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

  let activeSceneName = 'Hero (0-20%)';
  if (scrollProgress >= 0.85) activeSceneName = 'Contact (85-100%)';
  else if (scrollProgress >= 0.70) activeSceneName = 'Playground (70-85%)';
  else if (scrollProgress >= 0.45) activeSceneName = 'Projects (45-70%)';
  else if (scrollProgress >= 0.20) activeSceneName = 'About (20-45%)';

  return (
    <div className="relative min-h-[500svh] bg-slate-950 font-mono text-xs select-none">
      {/* Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Seam Diagnostic Overlay */}
      <div className="fixed top-4 left-4 z-50 p-4 bg-slate-900/95 border-2 border-emerald-500 rounded-lg shadow-2xl max-w-sm text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <h1 className="font-bold text-emerald-400 text-sm">SEAM & CHUNK EDGE INSPECTOR</h1>
          <a href="/" className="text-slate-400 hover:text-white underline text-[11px]">
            ← Portfolio
          </a>
        </div>

        <div className="space-y-1 mb-3 text-[11px] bg-slate-800/80 p-2.5 rounded border border-slate-700">
          <p className="flex justify-between">
            <span className="text-slate-400">Active Scene:</span>
            <span className="font-bold text-amber-300">{activeSceneName}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Scroll Progress:</span>
            <span className="font-bold text-yellow-400">{(scrollProgress * 100).toFixed(1)}%</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Camera Rounded / Float:</span>
            <span className="font-bold text-white">({cameraPos.x}, {cameraPos.y}) / ({cameraPos.floatX}, {cameraPos.floatY})</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Overscan Margin:</span>
            <span className="font-bold text-emerald-300">256 px (320×180 virtual)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">FPS / Image Smoothing:</span>
            <span className="font-bold text-green-400">{fps} FPS / false</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowOverscan(!showOverscan)}
            className={`py-1.5 px-2 rounded font-bold border text-[10px] ${
              showOverscan ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showOverscan ? 'Hide Overscan' : 'Show Overscan'}
          </button>
          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`py-1.5 px-2 rounded font-bold border text-[10px] ${
              showCorridors ? 'bg-amber-600/30 text-amber-200 border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showCorridors ? 'Hide Corridors' : 'Show Corridors'}
          </button>
        </div>
      </div>
    </div>
  );
}
