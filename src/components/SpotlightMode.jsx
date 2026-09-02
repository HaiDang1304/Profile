import { useState, useEffect } from 'react';
import { Lightbulb, LightbulbOff } from 'lucide-react';

export default function SpotlightMode() {
  const [isOn, setIsOn] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOn) return;
    
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOn]);

  return (
    <>
      <button 
        onClick={() => setIsOn(!isOn)}
        title="Toggle Spotlight Mode"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          background: isOn ? '#ef4444' : '#111827',
          color: '#fff',
          border: '2px solid #333',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
        }}
      >
        {isOn ? <LightbulbOff size={24} /> : <Lightbulb size={24} />}
      </button>

      {isOn && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998,
          background: `radial-gradient(circle 200px at ${pos.x}px ${pos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`
        }} />
      )}
    </>
  );
}
