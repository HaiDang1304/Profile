import { useEffect, useRef, useState } from 'react';
import { initScrollBridge, scrollBridge } from '../core/ScrollBridge';
import { EngineLoop } from '../core/EngineLoop';
import { viewportTransform } from '../core/ViewportTransform';

export default function AtmosphereDebugger() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const [telemetry, setTelemetry] = useState({
    qualityLevel: 'HIGH',
    averageFrameTime: 16.6,
    activeParticles: 0,
    freeParticles: 160,
    counts: {
      clouds: 0,
      leaves: 0,
      lightMotes: 0,
      fireflies: 0,
      stars: 0,
      smoke: 0,
    },
    enabled: {
      clouds: true,
      leaves: true,
      lightMotes: true,
      fireflies: true,
      stars: true,
      smoke: true,
    },
  });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [fps, setFps] = useState(60);

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
      if (engine.sceneManager && engine.sceneManager.atmosphere) {
        setTelemetry(engine.sceneManager.atmosphere.getTelemetry());
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

  const toggleEffect = (effectKey) => {
    if (engineRef.current?.sceneManager?.atmosphere) {
      const current = telemetry.enabled[effectKey];
      engineRef.current.sceneManager.atmosphere.setEffectEnabled(effectKey, !current);
      setTelemetry((prev) => ({
        ...prev,
        enabled: { ...prev.enabled, [effectKey]: !current },
      }));
    }
  };

  // Determine current active scene name from progress
  let activeSceneName = 'Hero (Bình minh)';
  if (scrollProgress >= 0.85) activeSceneName = 'Contact (Sông đêm & Bếp củi)';
  else if (scrollProgress >= 0.70) activeSceneName = 'Playground (Chòi lá chạng vạng)';
  else if (scrollProgress >= 0.45) activeSceneName = 'Projects (Bến xuồng hoàng hôn)';
  else if (scrollProgress >= 0.20) activeSceneName = 'About (Cầu khỉ ban ngày)';

  return (
    <div className="relative min-h-[500svh] bg-slate-950 font-mono text-xs select-none">
      {/* Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Floating Diagnostic Dashboard */}
      <div className="fixed top-4 left-4 z-50 p-4 bg-slate-900/95 border-2 border-emerald-500 rounded-lg shadow-2xl max-w-sm text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <h1 className="font-bold text-emerald-400 text-sm">ATMOSPHERE SYSTEM DEBUGGER</h1>
          <a href="/" className="text-slate-400 hover:text-white underline text-[11px]">
            ← Clean Portfolio
          </a>
        </div>

        {/* Real-time Telemetry */}
        <div className="space-y-1 mb-3 text-[11px] bg-slate-800/80 p-2.5 rounded border border-slate-700">
          <p className="flex justify-between">
            <span className="text-slate-400">Current Scene:</span>
            <span className="font-bold text-amber-300">{activeSceneName}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Scroll Progress:</span>
            <span className="font-bold text-yellow-400">{(scrollProgress * 100).toFixed(1)}%</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">FPS / Frame Time:</span>
            <span className="font-bold text-green-400">{fps} FPS ({telemetry.averageFrameTime} ms)</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Quality Level:</span>
            <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
              telemetry.qualityLevel === 'HIGH' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-amber-950 text-amber-300 border border-amber-500/50'
            }`}>
              {telemetry.qualityLevel}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-400">Active / Free Pool:</span>
            <span className="font-bold text-white">{telemetry.activeParticles} / {telemetry.freeParticles}</span>
          </p>
        </div>

        {/* Effect Counts & Individual Toggles */}
        <div className="space-y-1.5 mb-3">
          <h2 className="font-bold text-emerald-300 text-[11px] uppercase">✨ Atmosphere Particle Effects</h2>
          {[
            { key: 'clouds', label: '☁️ Pixel Clouds', count: telemetry.counts.clouds },
            { key: 'leaves', label: '🍃 Leaves & Petals', count: telemetry.counts.leaves },
            { key: 'lightMotes', label: '✨ Golden Light Motes', count: telemetry.counts.lightMotes },
            { key: 'fireflies', label: '🏮 River Fireflies', count: telemetry.counts.fireflies },
            { key: 'stars', label: '⭐ Night Stars', count: telemetry.counts.stars },
            { key: 'smoke', label: '🔥 Smoke & Embers', count: telemetry.counts.smoke },
          ].map((eff) => {
            const isEnabled = telemetry.enabled[eff.key];
            return (
              <button
                key={eff.key}
                onClick={() => toggleEffect(eff.key)}
                className={`w-full text-left px-2.5 py-1 rounded flex items-center justify-between transition-colors border ${
                  isEnabled
                    ? 'bg-emerald-600/20 text-emerald-200 border-emerald-500/60'
                    : 'bg-slate-800/80 text-slate-500 border-slate-700'
                }`}
              >
                <span className="text-[10px]">{eff.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-yellow-300">{eff.count}</span>
                  <span className="font-bold text-[9px]">{isEnabled ? 'ON' : 'OFF'}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2 bg-slate-800/50 rounded border border-slate-700/80 text-[10px] text-slate-400">
          Cuộn chuột dọc trang để kiểm tra mượt mà sự chuyển đổi profile hạt qua 6 cảnh.
        </div>
      </div>

      {/* Scroll Spacing to test transition through 0% to 100% */}
      <div className="relative z-10 pointer-events-none">
        <div className="h-[100svh] flex items-center justify-end p-8 text-right text-slate-500">
          Hero — Motes & Clouds (0-20%) ↓
        </div>
        <div className="h-[125svh] flex items-center justify-end p-8 text-right text-slate-500">
          About — Leaves & Breeze (20-45%) ↓
        </div>
        <div className="h-[125svh] flex items-center justify-end p-8 text-right text-slate-500">
          Projects — Sunset Waters (45-70%) ↓
        </div>
        <div className="h-[75svh] flex items-center justify-end p-8 text-right text-slate-500">
          Playground — Fireflies & Dusk (70-85%) ↓
        </div>
        <div className="h-[75svh] flex items-center justify-end p-8 text-right text-slate-500">
          Contact — Stars & Firewood Smoke (85-100%)
        </div>
      </div>
    </div>
  );
}
