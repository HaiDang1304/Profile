import { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import { animalSprites, drawSprite } from '../lib/animalSprites';

// Helper component to render a single sprite on a tiny canvas
function SpriteIcon({ sprite, selected, onClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // center is 25, 25 for a 50x50 canvas
      drawSprite(ctx, sprite, 25, 25, 3);
    }
  }, [sprite]);

  return (
    <div 
      onClick={onClick}
      style={{
        minWidth: '50px',
        height: '50px',
        borderRadius: '8px',
        border: selected ? '3px solid #10b981' : '2px solid #374151',
        background: selected ? 'rgba(16, 185, 129, 0.1)' : '#1f2937',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        transform: selected ? 'scale(1.1)' : 'scale(1)',
        flexShrink: 0
      }}
      title={sprite.name}
    >
      <canvas ref={canvasRef} width={50} height={50} style={{ imageRendering: 'pixelated' }} />
    </div>
  );
}

export default function VisitorBox() {
  const [visitors, setVisitors] = useState([]);
  const [name, setName] = useState('');
  const [animalId, setAnimalId] = useState(0); // Index in animalSprites
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canvasRef = useRef(null);
  const visitorsRef = useRef([]);

  useEffect(() => {
    fetch('/api/visitors')
      .then(r => r.json())
      .then(data => {
        setVisitors(data);
        visitorsRef.current = data.map(v => {
          let aId = parseInt(v.accessory);
          // Map old invalid IDs or out of bounds to a random valid sprite
          if (isNaN(aId) || aId < 0 || aId >= animalSprites.length) {
            aId = Math.floor(Math.random() * animalSprites.length);
          }
          return {
            ...v,
            x: Math.random() * 600,
            y: Math.random() * 400,
            targetX: Math.random() * 600,
            targetY: Math.random() * 400,
            vx: 0,
            vy: 0,
            bouncePhase: Math.random() * Math.PI * 2,
            animalId: aId
          };
        });
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let frame = 0;
    
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const vList = visitorsRef.current;

      // Group behavior: mode 0 (wander), mode 1 (flock)
      const mode = Math.floor(frame / 600) % 2;

      vList.forEach((p) => {
        if (mode === 0) { 
          if (Math.random() < 0.02) {
            p.targetX = Math.max(20, Math.min(canvas.width - 20, p.x + (Math.random() - 0.5) * 100));
            p.targetY = Math.max(30, Math.min(canvas.height - 30, p.y + (Math.random() - 0.5) * 100));
          }
        } else if (mode === 1) { 
          if (Math.random() < 0.05) {
            p.targetX = canvas.width / 2 + (Math.random() - 0.5) * 300;
            p.targetY = canvas.height / 2 + (Math.random() - 0.5) * 200;
          }
        }

        p.x += (p.targetX - p.x) * 0.02;
        p.y += (p.targetY - p.y) * 0.02;

        const jump = Math.sin(frame * 0.1 + p.bouncePhase) * 4;
        
        const sprite = animalSprites[p.animalId] || animalSprites[0];
        const isMovingLeft = p.targetX < p.x;
        
        ctx.save();
        const drawX = p.x;
        const drawY = p.y + jump;
        
        if (isMovingLeft) {
          ctx.translate(drawX, drawY);
          ctx.scale(-1, 1);
          drawSprite(ctx, sprite, 0, 0, 3);
        } else {
          ctx.translate(drawX, drawY);
          drawSprite(ctx, sprite, 0, 0, 3);
        }
        ctx.restore();

        // Draw Name text
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(p.name, p.x, p.y + jump - 22);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [visitors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: '#ffffff', accessory: animalId.toString() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi mạng');
      
      const newV = {
        ...data,
        x: canvasRef.current ? canvasRef.current.width / 2 : 300,
        y: canvasRef.current ? canvasRef.current.height / 2 : 200,
        targetX: canvasRef.current ? canvasRef.current.width / 2 : 300,
        targetY: canvasRef.current ? canvasRef.current.height / 2 : 200,
        vx: 0,
        vy: 0,
        bouncePhase: 0,
        animalId: animalId
      };
      
      setVisitors(prev => [newV, ...prev]);
      visitorsRef.current.push(newV);
      setName('');
    } catch (err) {
      setErrorMsg(err.message);
    }
    setLoading(false);
  };

  return (
    <section className="content-section visitor-section" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="section-grid">
        <div className="section-heading reveal" style={{ textAlign: 'center' }}>
          <span className="section-tag">GUESTBOOK</span>
          <h2>Lưu Dấu Ấn Pixel</h2>
          <p>Chọn một nhân vật đại diện và để lại tên của bạn trong thế giới pixel này nhé!</p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          background: '#111827',
          border: '2px solid #333',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }} className="reveal">
          
          <div className="visitor-canvas" style={{ 
            background: 'linear-gradient(180deg, #1e1e2f 0%, #151522 100%)', 
            border: '4px solid #1f2937', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            position: 'relative', 
            height: '400px',
            width: '100%',
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)'
          }}>
             <canvas ref={canvasRef} width={800} height={400} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }} />
             {visitors.length === 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6b7280', fontSize: '1rem', textAlign: 'center', fontFamily: 'monospace' }}>Chưa có ai ở đây cả.<br/>Hãy là người đầu tiên!</div>}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>1. Chọn nhân vật của bạn</span>
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                overflowX: 'auto', 
                padding: '10px 0',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4b5563 transparent'
              }}>
                {animalSprites.map((sprite, idx) => (
                  <SpriteIcon 
                    key={sprite.id} 
                    sprite={sprite} 
                    selected={animalId === idx} 
                    onClick={() => setAnimalId(idx)} 
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <label style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>2. Nhập tên hiển thị</span>
                <input 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Ví dụ: John Doe" 
                  maxLength={15} 
                  style={{ 
                    background: '#1f2937', 
                    border: '2px solid #374151', 
                    borderRadius: '8px',
                    color: '#fff', 
                    padding: '1rem', 
                    width: '100%', 
                    outline: 'none', 
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s'
                  }} 
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#374151'}
                />
              </label>

              <button 
                disabled={loading} 
                className="pixel-button" 
                type="submit" 
                style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  padding: '1rem 2rem', 
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  flex: '1 1 150px'
                }}
              >
                {loading ? 'ĐANG KÝ TÊN...' : 'KÝ TÊN'} <Send size={18} />
              </button>
            </div>

            {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.9rem', fontFamily: '"JetBrains Mono", monospace', margin: 0 }}>{errorMsg}</p>}
            
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>
              <Users size={16} /> Đã có {visitors.length} người lưu dấu ấn
            </div>
            
          </form>
        </div>
      </div>
    </section>
  );
}
