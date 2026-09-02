import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';
import { Send, Users } from 'lucide-react';

export default function VisitorBox() {
  const [visitors, setVisitors] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
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
    try {
      await apiRequest('/visitors', { method: 'POST', body: { name } });
      setName('');
      fetchVisitors();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Animation Loop for floating pixels
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Each visitor gets a particle
    let particles = visitors.map((v, i) => ({
      text: v.name,
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 50,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -0.5 - Math.random() * 1.5,
      color: `hsl(${(i * 137) % 360}, 70%, 60%)`,
      size: 4 + Math.random() * 4
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        // Wrap around top
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }

        // Draw pixel sprite (a simple jumping block)
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
        ctx.fillRect(Math.round(p.x - 2), Math.round(p.y + p.size), Math.round(p.size + 4), 2);
        
        // Draw Name
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, Math.round(p.x + p.size/2), Math.round(p.y - 6));
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
