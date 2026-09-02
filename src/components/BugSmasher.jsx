import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';

export default function BugSmasher() {
  const [bug, setBug] = useState(null);
  const [totalBugs, setTotalBugs] = useState(0);

  useEffect(() => {
    apiRequest('/bugs').then(data => {
      setTotalBugs(data.bugs_smashed);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    // Spawn a bug every 30 to 60 seconds
    const scheduleBug = () => {
      const delay = 30000 + Math.random() * 30000;
      setTimeout(() => {
        spawnBug();
        scheduleBug();
      }, delay);
    };
    
    // Initial spawn slightly faster for testing
    setTimeout(spawnBug, 5000);
    scheduleBug();
  }, []);

  const spawnBug = () => {
    if (Math.random() > 0.5) {
      // Top to bottom
      setBug({
        id: Date.now(),
        x: Math.random() * (window.innerWidth - 50),
        y: -20,
        tx: Math.random() * window.innerWidth,
        ty: window.innerHeight + 20,
        rotation: 180,
      });
    } else {
      // Left to right
      setBug({
        id: Date.now(),
        x: -20,
        y: Math.random() * (window.innerHeight - 50),
        tx: window.innerWidth + 20,
        ty: Math.random() * window.innerHeight,
        rotation: 90,
      });
    }
  };

  const smashBug = async () => {
    if (!bug) return;
    const currentId = bug.id;
    setBug(null); // Hide bug
    
    // Add blood splat
    const splat = document.createElement('div');
    splat.style.position = 'fixed';
    splat.style.left = \`\${bug.x}px\`;
    splat.style.top = \`\${bug.y}px\`;
    splat.style.width = '30px';
    splat.style.height = '30px';
    splat.style.background = 'url("data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Cpath fill=\\'%23ef4444\\' d=\\'M50,10 C20,20 10,50 30,80 C60,90 90,60 70,30 Z\\'/%3E%3C/svg%3E") no-repeat center';
    splat.style.zIndex = 9999;
    splat.style.pointerEvents = 'none';
    splat.style.transition = 'opacity 2s';
    document.body.appendChild(splat);
    setTimeout(() => { splat.style.opacity = '0'; }, 1000);
    setTimeout(() => { document.body.removeChild(splat); }, 3000);

    // Optimistic
    setTotalBugs(prev => prev + 1);

    try {
      const res = await apiRequest('/bugs', { method: 'POST' });
      setTotalBugs(res.bugs_smashed);
    } catch (e) {
      console.error(e);
    }
  };

  // Move bug manually
  useEffect(() => {
    if (!bug) return;
    let frame;
    const speed = 2; // pixels per frame
    
    const update = () => {
      setBug(prev => {
        if (!prev) return prev;
        const dx = prev.tx - prev.x;
        const dy = prev.ty - prev.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < speed) return null; // Reached target, disappear
        
        return {
          ...prev,
          x: prev.x + (dx/dist) * speed,
          y: prev.y + (dy/dist) * speed,
          // Wobble rotation
          wobble: Math.sin(Date.now() / 100) * 10
        };
      });
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [bug?.id]); // Only re-run when a new bug spawns

  return (
    <>
      <div style={{
        position: 'fixed', bottom: '10px', left: '10px', 
        fontSize: '10px', fontFamily: 'monospace', color: '#6b7280',
        pointerEvents: 'none', zIndex: 50
      }}>
        {totalBugs > 0 && \`BUGS FIXED: \${totalBugs}\`}
      </div>

      {bug && (
        <div 
          onClick={smashBug}
          style={{
            position: 'fixed',
            left: bug.x,
            top: bug.y,
            width: '24px',
            height: '24px',
            cursor: 'crosshair',
            zIndex: 9998,
            transform: \`translate(-50%, -50%) rotate(\${bug.rotation + (bug.wobble || 0)}deg)\`,
            // simple pixel bug representation using box-shadow
            background: '#111',
            boxShadow: '0 0 0 2px #333, -4px 0 0 #000, 4px 0 0 #000, 0 -4px 0 #000, 0 4px 0 #000'
          }}
        />
      )}
    </>
  );
}
