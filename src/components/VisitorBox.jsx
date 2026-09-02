import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';
import { Send, Users } from 'lucide-react';

export default function VisitorBox() {
  const [visitors, setVisitors] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef(null);

  const fetchVisitors = async () => {
    try {
      const data = await apiRequest('/visitors');
      setVisitors(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await apiRequest('/visitors', { method: 'POST', body: JSON.stringify({ name }) });
      setName('');
      fetchVisitors();
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Advanced Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let frame = 0;
    
    // Behaviors: 0=Bounce, 1=Snake/Chase, 2=Orbit, 3=March
    let mode = 0;
    let modeTimer = 0;

    let particles = visitors.map((v, i) => ({
      id: i,
      text: v.name,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      targetX: 0,
      targetY: 0,
      color: `hsl(${(i * 137) % 360}, 70%, 60%)`,
      size: 10 + Math.random() * 4,
      bouncePhase: Math.random() * Math.PI * 2,
      history: []
    }));

    const render = () => {
      frame++;
      modeTimer++;
      
      // Switch mode every 500 frames (approx 8s)
      if (modeTimer > 500) {
        modeTimer = 0;
        mode = (mode + 1) % 4;
      }

      ctx.fillStyle = 'rgba(17, 24, 39, 0.4)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach((p, i) => {
        // Record history for snake mode
        p.history.unshift({ x: p.x, y: p.y });
        if (p.history.length > 20) p.history.pop();

        if (mode === 0) { // Free Bounce (Chạy tán loạn)
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 20 || p.x > canvas.width - 20) p.vx *= -1;
          if (p.y < 20 || p.y > canvas.height - 20) p.vy *= -1;
        } 
        else if (mode === 1) { // Pacman Chase (Rượt đuổi)
          if (i === 0) { 
            // Pacman runs around in a large Lissajous curve
            p.targetX = cx + Math.sin(frame * 0.02) * (canvas.width * 0.4);
            p.targetY = cy + Math.sin(frame * 0.03) * (canvas.height * 0.4);
            p.x += (p.targetX - p.x) * 0.05;
            p.y += (p.targetY - p.y) * 0.05;
            p.vx = p.targetX - p.x;
            p.vy = p.targetY - p.y;
          } else {
            // Ghosts follow the history of the one in front of them
            const leader = particles[i - 1];
            const targetPos = leader.history[10] || leader; 
            p.x += (targetPos.x - p.x) * 0.1;
            p.y += (targetPos.y - p.y) * 0.1;
            p.vx = targetPos.x - p.x;
            p.vy = targetPos.y - p.y;
          }
        }
        else if (mode === 2) { // Orbit (Xếp hàng chạy vòng tròn)
          const radius = 60 + (i * 20) % 150;
          const speed = 0.02;
          const angle = frame * speed + (i * 0.5);
          p.targetX = cx + Math.cos(angle) * radius;
          p.targetY = cy + Math.sin(angle) * radius;
          p.x += (p.targetX - p.x) * 0.08;
          p.y += (p.targetY - p.y) * 0.08;
          p.vx = p.targetX - p.x;
          p.vy = p.targetY - p.y;
        }
        else if (mode === 3) { // March in rows (Chạy tới chạy lui)
          const cols = 6;
          const row = Math.floor(i / cols);
          const col = i % cols;
          // Move left to right and wrap around
          const speed = 1.5;
          const marchOffset = (frame * speed + col * 80) % (canvas.width + 100) - 50;
          
          p.targetX = marchOffset;
          p.targetY = 80 + row * 60;
          
          p.x += (p.targetX - p.x) * 0.1;
          p.y += (p.targetY - p.y) * 0.1;
          p.vx = speed;
          p.vy = 0;
        }

        // Draw Pixel Sprite
        const jump = Math.sin(frame * 0.2 + p.bouncePhase) * 4;
        ctx.fillStyle = p.color;
        
        if (mode === 1 && i === 0) {
           // Pacman Leader
           ctx.beginPath();
           const mouthAngle = 0.2 + Math.abs(Math.sin(frame * 0.3)) * 0.4;
           const dirAngle = Math.atan2(p.vy, p.vx);
           ctx.arc(p.x, p.y + jump, p.size + 6, dirAngle + mouthAngle, dirAngle + Math.PI*2 - mouthAngle);
           ctx.lineTo(p.x, p.y + jump);
           ctx.fill();
        } else {
           // Normal Ghost/Block
           ctx.fillRect(p.x - p.size/2, p.y + jump - p.size/2, p.size, p.size);
           // Eyes based on movement direction
           ctx.fillStyle = '#fff';
           const eyeOffsetX = p.vx > 0 ? 2 : p.vx < 0 ? -2 : 0;
           ctx.fillRect(p.x - p.size/4 + eyeOffsetX, p.y + jump - p.size/4, 2, 2);
           ctx.fillRect(p.x + p.size/4 - 2 + eyeOffsetX, p.y + jump - p.size/4, 2, 2);
        }

        // Draw Name text
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y + jump - p.size - 8);
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [visitors]);

  return (
    <section className="content-section visitor-section" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="section-grid">
        <div className="section-heading reveal">
          <span className="section-tag">GUESTBOOK</span>
          <h2>Ký tên & Lưu dấu ấn</h2>
          <p>Nhập tên để xuất hiện trong thế giới pixel của mình nhé!</p>
        </div>
        
        <div className="visitor-layout" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 2fr' }}>
          <form className="pixel-window reveal" onSubmit={handleSubmit}>
            <div className="window-bar">
              <span>CHECK_IN.EXE</span>
              <div><i /><i /><i /></div>
            </div>
            <div className="form-grid" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label className="form-full">
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888' }}>TÊN CỦA BẠN *</span>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên..." maxLength={15} style={{ background: '#0a0a0a', border: '2px solid #333', color: '#fff', padding: '0.8rem', width: '100%', outline: 'none', fontFamily: 'monospace' }} />
              </label>
              <button disabled={loading} className="pixel-button pixel-button--primary" type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                {loading ? 'ĐANG GỬI...' : 'ĐIỂM DANH'} <Send size={16} />
              </button>

              {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>{errorMsg}</p>}
              
              <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Users size={14} /> <span>{visitors.length} LƯỢT TRUY CẬP</span>
                </div>
                <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {visitors.map(v => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #333', paddingBottom: '0.2rem' }}>
                      <span style={{ color: '#ccc' }}>{v.name}</span>
                      <span style={{ color: '#555' }}>{v.ip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
          
          <div className="visitor-canvas reveal" style={{ background: '#111827', border: '4px solid #1f2937', borderRadius: '8px', overflow: 'hidden', position: 'relative', minHeight: '350px' }}>
             <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }} />
             {visitors.length === 0 && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#4b5563', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'monospace' }}>Chưa có ai ở đây cả.<br/>Hãy là người đầu tiên!</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
