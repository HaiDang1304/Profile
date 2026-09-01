import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { spriteCache } from '../core/SpriteCache';
import { SPRITE_MANIFEST, registerAllSprites } from '../data/spriteManifest';

const SCENES = [
  { id: 'hero', label: '1. Trang chủ (Hero)' },
  { id: 'about', label: '2. Về mình (About)' },
  { id: 'projects', label: '3. Dự án (Projects)' },
  { id: 'technology', label: '4. Công nghệ (Technology)' },
  { id: 'playground', label: '5. Giải trí (Playground)' },
  { id: 'contact', label: '6. Liên hệ (Contact)' }
];

const CATEGORIES = [
  { id: 'ground', label: 'Bề mặt & Nước (Ground & Water)' },
  { id: 'landscape', label: 'Cây cỏ & Kiến trúc (Landscape)' },
  { id: 'object', label: 'Vật thể & Nhân vật (Objects & Characters)' }
];

export default function SpriteShowcase() {
  const [scale, setScale] = useState(2); // 1x, 2x, 4x
  const [bgTheme, setBgTheme] = useState('dark'); // 'dark', 'light', 'navy'
  const [showGrid, setShowGrid] = useState(true);
  const [animFrame, setAnimFrame] = useState(0);
  const [activeScene, setActiveScene] = useState('hero');

  const canvasRefs = useRef(new Map());

  useEffect(() => {
    registerAllSprites();
  }, []);

  // Animation ticker for animated sprites - increased framerate for smoother animations
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimFrame((prev) => (prev + 1) % 60); // Use a larger modulus to handle different frame counts (e.g. 3, 4, 5, 6)
    }, 150); // Faster tick for smoother movement (150ms instead of 240ms)
    return () => clearInterval(timer);
  }, []);

  // Draw sprite canvases at selected scale
  useEffect(() => {
    SPRITE_MANIFEST.forEach((sprite) => {
      // Only draw sprites that match the current scene to save performance
      if (sprite.scene !== activeScene && activeScene !== 'all') return;

      const canvasEl = canvasRefs.current.get(sprite.key);
      if (!canvasEl) return;

      const frame = sprite.animated ? animFrame % sprite.frameCount : 0;
      const cachedCanvas = spriteCache.get(sprite.key, frame);

      if (!cachedCanvas) return;

      canvasEl.width = sprite.width * scale;
      canvasEl.height = sprite.height * scale;

      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      // Draw sprite scaled using nearest neighbor
      ctx.drawImage(cachedCanvas, 0, 0, canvasEl.width, canvasEl.height);

      // Draw Anchor Point Marker (Red crosshair)
      const ax = sprite.anchorX * scale;
      const ay = sprite.anchorY * scale;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ax - 4, ay);
      ctx.lineTo(ax + 4, ay);
      ctx.moveTo(ax, ay - 4);
      ctx.lineTo(ax, ay + 4);
      ctx.stroke();
    });
  }, [scale, animFrame, bgTheme, activeScene]);

  const sceneSprites = SPRITE_MANIFEST.filter(s => s.scene === activeScene || activeScene === 'all');

  const bgStyles = {
    dark: 'bg-[#0f172a] text-slate-100',
    light: 'bg-[#f1f5f9] text-slate-900',
    navy: 'bg-[#080d1a] text-slate-100',
  };

  const cardBgStyles = {
    dark: 'bg-[#1e293b] border-slate-700',
    light: 'bg-white border-slate-300 shadow-md',
    navy: 'bg-[#0d1527] border-sky-900',
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 font-mono ${bgStyles[bgTheme]}`}>
      {/* Header & Controls */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-slate-700 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-400">
              PHÂN LOẠI ART THEO BỐI CẢNH (SCENES)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Kiểm tra các Sprite đại diện miền Tây chi tiết với chuyển động mượt mà, phân loại nghiêm ngặt theo Ground, Landscape, Object.
            </p>
          </div>

          <Link
            to="/"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition-colors"
          >
            ← Quay lại Portfolio (Phase 0)
          </Link>
        </div>

        {/* View Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-4 text-xs mb-4">
          {/* Zoom Scale */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <span className="text-slate-400 font-bold">Scale:</span>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`px-2.5 py-1 rounded font-bold ${
                  scale === s ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Background Theme */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700">
            <span className="text-slate-400 font-bold">Background:</span>
            {['dark', 'light', 'navy'].map((t) => (
              <button
                key={t}
                onClick={() => setBgTheme(t)}
                className={`px-2 py-1 rounded capitalize font-bold ${
                  bgTheme === t ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Pixel Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1.5 rounded font-bold border ${
              showGrid ? 'bg-sky-600 text-white border-sky-400' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Grid: {showGrid ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {/* Scene Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 p-2 bg-slate-900/50 rounded-lg border border-slate-800">
          <span className="text-slate-400 font-bold px-2">Bối cảnh:</span>
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={`px-4 py-2 rounded font-bold transition-colors ${
                activeScene === scene.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {scene.label}
            </button>
          ))}
          <button
            onClick={() => setActiveScene('all')}
            className={`px-4 py-2 rounded font-bold transition-colors ml-auto ${
              activeScene === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Tất cả (All)
          </button>
        </div>
      </div>

      {/* Categories Grouping View */}
      <div className="max-w-7xl mx-auto mb-10">
        {CATEGORIES.map(category => {
          const categorySprites = sceneSprites.filter(s => s.category === category.id);
          
          if (categorySprites.length === 0) return null;

          return (
            <div key={category.id} className="mb-12">
              <h2 className="text-xl font-bold text-sky-300 mb-6 flex items-center gap-3 border-b border-slate-700/50 pb-2">
                <span className="text-2xl">{category.id === 'ground' ? '🟫' : category.id === 'landscape' ? '🌴' : '📦'}</span>
                {category.label}
                <span className="text-sm font-normal text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full ml-auto">
                  {categorySprites.length} art
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySprites.map((sprite) => {
                  return (
                    <div
                      key={sprite.key}
                      className={`p-5 rounded-lg border flex flex-col justify-between ${cardBgStyles[bgTheme]}`}
                    >
                      {/* Top Info */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            sprite.category === 'ground' ? 'bg-amber-900/30 text-amber-500 border border-amber-900/50' :
                            sprite.category === 'landscape' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' :
                            'bg-sky-900/30 text-sky-400 border border-sky-900/50'
                          }`}>
                            {sprite.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {sprite.width} × {sprite.height} px
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-1">{sprite.name}</h3>
                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">{sprite.description}</p>
                      </div>

                      {/* Sprite Canvas Display Viewport */}
                      <div
                        className={`relative flex items-center justify-center p-4 rounded border overflow-auto min-h-[140px] ${
                          bgTheme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/80 border-slate-800'
                        } ${showGrid ? 'bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:16px_16px]' : ''}`}
                      >
                        <canvas
                          ref={(el) => {
                            if (el) canvasRefs.current.set(sprite.key, el);
                          }}
                          style={{ imageRendering: 'pixelated' }}
                          className="block shadow-md"
                        />
                      </div>

                      {/* Bottom Technical Metadata */}
                      <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span className="text-slate-500 block">Scene:</span>
                          <span className="text-amber-400 font-bold uppercase">{sprite.scene}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Layer Target:</span>
                          <span className="text-yellow-400 font-bold uppercase">{sprite.layer}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Frames:</span>
                          <span className={sprite.animated ? "text-emerald-400 font-bold" : "text-slate-300"}>
                            {sprite.animated ? `${sprite.frameCount} Frames (Anim)` : '1 Frame (Static)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Anchor:</span>
                          <span className="text-slate-300 font-bold font-mono">({sprite.anchorX}, {sprite.anchorY})</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer padding */}
      <div className="h-10"></div>
    </div>
  );
}
