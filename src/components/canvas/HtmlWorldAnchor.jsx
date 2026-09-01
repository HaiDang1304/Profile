import { useEffect, useRef } from 'react';
import { registerWorldAnchor } from './core/WorldAnchorRegistry';

export default function HtmlWorldAnchor({ sceneId, wx, wy, parallaxFactor = 1, children, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    return registerWorldAnchor({ element: el, sceneId, wx, wy, parallaxFactor, isInteractive: false });
  }, [sceneId, wx, wy, parallaxFactor]);

  return (
    <div
      ref={containerRef}
      className={`absolute top-0 left-0 w-screen h-screen pointer-events-none flex flex-col justify-center items-center ${className}`}
      style={{ willChange: 'transform, opacity', opacity: 0 }}
    >
      <div className="w-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
