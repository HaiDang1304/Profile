import { useEffect, useRef } from 'react';

export default function PixiWorldCanvas() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let disposed = false;
    let engine = null;
    import('./pixi/PixiWorldEngine')
      .then(({ PixiWorldEngine }) => {
        if (disposed) return;
        engine = new PixiWorldEngine(host);
        return engine.init();
      })
      .catch((error) => {
        if (disposed) return;
        console.error('Unable to initialize the PixiJS world.', error);
        host.dataset.rendererState = 'error';
      });

    return () => {
      disposed = true;
      engine?.destroy();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="pixi-world-host fixed inset-0 pointer-events-none z-0 select-none"
      data-renderer="pixijs-v8"
      data-renderer-state="loading"
      aria-hidden="true"
    />
  );
}
