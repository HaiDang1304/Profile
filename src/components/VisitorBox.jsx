import { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import { animalSprites, drawSprite } from '../lib/animalSprites';

function SpriteIcon({ sprite, selected, onClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSprite(ctx, sprite, 25, 25, 3);
    }
  }, [sprite]);

  return (
    <div 
      onClick={onClick}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '8px',
        border: selected ? '2px solid #10b981' : '2px solid #374151',
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
  const [animalId, setAnimalId] = useState(0);
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
        <div className="section-heading reveal">
          <span className="section-tag">GUESTBOOK</span>
          <h2>Lưu Dấu Ấn Pixel</h2>
          <p>Chọn một nhân vật đại diện và để lại tên của bạn trong thế giới pixel này nhé!</p>
        </div>
        
        {/* Responsive Grid Layout */}
        <div className="reveal" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          
          {/* Left Column: Form */}
          <form className="pixel-window" onSubmit={handleSubmit} style={{ 
            display: 'flex', flexDirection: 'column', height: '100%',
            background: '#0a0a0a', border: '2px solid #333', borderRadius: '8px' 
          }}>
            <div className="window-bar" style={{ padding: '8px 12px', borderBottom: '2px solid #333', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>CHECK_IN.EXE</span>
              <div style={{ display: 'flex', gap: '6px' }}><i style={{width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}/><i style={{width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}/><i style={{width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}/></div>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888' }}>1. CHỌN NHÂN VẬT CỦA BẠN</span>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  flexWrap: 'wrap',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  padding: '4px',
                  scrollbarWidth: 'thin'
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

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888' }}>2. TÊN CỦA BẠN *</span>
                <input 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Nhập tên..." 
                  maxLength={15} 
                  style={{ 
                    background: '#0a0a0a', border: '2px solid #333', color: '#fff', 
                    padding: '0.8rem', outline: 'none', fontFamily: 'monospace'
                  }} 
                />
              </label>

              <div style={{ marginTop: 'auto' }}>
                <button 
                  disabled={loading} 
                  className="pixel-button pixel-button--primary" 
                  type="submit" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  {loading ? 'ĐANG KÝ TÊN...' : 'ĐIỂM DANH'} <Send size={16} />
                </button>
                
                {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>{errorMsg}</p>}
                
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={14} /> <span>{visitors.length} LƯỢT TRUY CẬP</span>
                </div>
              </div>
            </div>
          </form>

          {/* Right Column: Canvas */}
          <div className="visitor-canvas" style={{ 
            background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)', 
            border: '2px solid #333', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            position: 'relative', 
            minHeight: '350px',
            height: '100%',
            boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)'
          }}>
             <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }} />
             {visitors.length === 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#4b5563', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'monospace' }}>Chưa có ai ở đây cả.<br/>Hãy là người đầu tiên!</div>}
          </div>
          
        </div>
      </div>
    </section>
  );
}
