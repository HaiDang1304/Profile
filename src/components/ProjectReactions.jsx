import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Heart, Flame, Rocket } from 'lucide-react';

export default function ProjectReactions({ projectId }) {
  const [reactions, setReactions] = useState({ heart: 0, fire: 0, rocket: 0 });
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    apiRequest('/reactions').then(data => {
      const projReactions = data.filter(r => r.project_id === projectId);
      const counts = { heart: 0, fire: 0, rocket: 0 };
      projReactions.forEach(r => counts[r.type] = r.count);
      setReactions(counts);
    }).catch(console.error);
  }, [projectId]);

  const handleReact = async (type) => {
    // Add flying animation
    const id = Date.now() + Math.random();
    setAnimations(prev => [...prev, { id, type }]);
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== id));
    }, 1000);

    // Optimistic update
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));

    try {
      const res = await apiRequest(`/reactions/${projectId}`, { method: 'POST', body: JSON.stringify({ type }) });
      setReactions(prev => ({ ...prev, [type]: res.count }));
    } catch (err) {
      console.error(err);
      // Revert on error
      setReactions(prev => ({ ...prev, [type]: prev[type] - 1 }));
    }
  };

  const Icon = { heart: Heart, fire: Flame, rocket: Rocket };
  const colors = { heart: '#ef4444', fire: '#f97316', rocket: '#8b5cf6' };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', position: 'relative' }}>
      {['heart', 'fire', 'rocket'].map(type => {
        const I = Icon[type];
        return (
          <button 
            key={type}
            onClick={() => handleReact(type)}
            style={{ 
              background: '#111827', border: '1px solid #374151', borderRadius: '4px', 
              padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
              color: colors[type], cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem',
              transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <I size={14} /> <span>{reactions[type]}</span>
          </button>
        )
      })}
      
      {/* Floating animations */}
      {animations.map(anim => {
        const I = Icon[anim.type];
        return (
          <div key={anim.id} style={{
            position: 'absolute',
            left: anim.type === 'heart' ? '15%' : anim.type === 'fire' ? '50%' : '85%',
            bottom: '20px',
            color: colors[anim.type],
            animation: 'floatUp 1s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <I size={18} fill={colors[anim.type]} />
          </div>
        )
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
