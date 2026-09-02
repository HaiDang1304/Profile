import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gem } from 'lucide-react';

const TOTAL_EGGS = 5;

// Global event bus for eggs
export const eggFound = (id) => {
  window.dispatchEvent(new CustomEvent('easter-egg-found', { detail: id }));
};

export function EasterEgg({ id }) {
  const [found, setFound] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('easter-eggs') || '[]');
    if (saved.includes(id)) {
      setFound(true);
    }
  }, [id]);

  if (found) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setFound(true);
        eggFound(id);
      }}
      style={{
        position: 'absolute',
        zIndex: 50,
        cursor: 'pointer',
        color: '#fbbf24',
        opacity: 0.5,
        transition: 'all 0.2s',
      }}
      className="easter-egg-gem"
      title="You found a secret gem!"
    >
      <Gem size={16} />
    </div>
  );
}

export function EasterEggManager() {
  const [foundEggs, setFoundEggs] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('easter-eggs') || '[]');
    setFoundEggs(saved);
  }, []);

  useEffect(() => {
    const handleFound = (e) => {
      const id = e.detail;
      setFoundEggs(prev => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        localStorage.setItem('easter-eggs', JSON.stringify(next));
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        if (next.length === TOTAL_EGGS) {
          triggerFireworks();
        } else {
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#fbbf24', '#f59e0b']
          });
        }
        return next;
      });
    };

    window.addEventListener('easter-egg-found', handleFound);
    return () => window.removeEventListener('easter-egg-found', handleFound);
  }, []);

  const triggerFireworks = () => {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  if (foundEggs.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      <div style={{
        background: 'rgba(8, 14, 28, 0.9)',
        border: '2px solid #fbbf24',
        padding: '6px 12px',
        color: '#fbbf24',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        borderRadius: '4px',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
      }}>
        SECRETS: {foundEggs.length}/{TOTAL_EGGS}
      </div>
      
      {showToast && (
        <div style={{
          background: '#fbbf24',
          color: '#000',
          padding: '8px 14px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '4px',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
          animation: 'toast-slide-in 0.3s ease-out'
        }}>
          Gem found! Keep looking!
        </div>
      )}
    </div>
  );
}
