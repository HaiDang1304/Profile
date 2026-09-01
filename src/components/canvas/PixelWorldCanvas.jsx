import { useEffect, useRef } from 'react';
import { initScrollBridge } from './core/ScrollBridge';
import { EngineLoop } from './core/EngineLoop';
import { viewportTransform } from './core/ViewportTransform';

export default function PixelWorldCanvas({ renderMode = 'scene' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas with clamped DPR and configure ViewportTransform
    const updateSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      // We don't need CSS width/height if we're just using it as a texture,
      // but keeping it doesn't hurt.
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;

      viewportTransform.resize({
        viewportWidth: vw,
        viewportHeight: vh,
        devicePixelRatio: dpr,
      });
    };
    updateSize();

    // 1. Initialize passive scroll bridge
    const cleanupScroll = initScrollBridge();

    // 2. Initialize Engine Loop (single RAF)
    const engine = new EngineLoop(canvas, { renderMode });
    engine.start();

    // 3. Handle window resize
    const handleResize = () => {
      updateSize();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup on unmount
    return () => {
      engine.stop();
      cleanupScroll();
      window.removeEventListener('resize', handleResize);
    };
  }, [renderMode]);

  return (
    <div className="pixel-world-canvas-container fixed inset-0 pointer-events-none z-0 select-none" aria-hidden="true">
      <canvas ref={canvasRef} className="pixel-world-canvas block w-full h-full">
        Trình duyệt của bạn không hỗ trợ HTML5 Canvas.
      </canvas>
    </div>
  );
}
