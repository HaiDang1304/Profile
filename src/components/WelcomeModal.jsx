import { useState, useEffect } from 'react';
import { Terminal, ChevronRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('portfolio-seen-guide');
    if (!hasSeen) {
      // Show after a short delay for dramatic effect
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('portfolio-seen-guide', 'true');
  };

  if (!isOpen) return null;

  const features = [
    { cmd: "sys.get('avatar')", desc: "Tự thiết kế Pixel Avatar ở cuối trang" },
    { cmd: "sys.trigger('reaction')", desc: "Thả cảm xúc tương tác vào các dự án" },
    { cmd: "sys.spawn('bug')", desc: "Đập những con bọ chạy ngang màn hình để nhận điểm" },
    { cmd: "sys.note('double_click')", desc: "Nhấp đúp chuột vào bất kỳ đâu để dán Sticky Note" },
    { cmd: "sys.toggle('spotlight')", desc: "Bật chế độ đèn pin (góc dưới bên trái màn hình)" },
    { cmd: "sys.quest('easter_egg')", desc: "Tìm 5 viên ngọc ẩn để kích hoạt pháo hoa" },
    { cmd: "sys.open('terminal')", desc: "Bấm phím `~` hoặc nút _CMD ở footer để mở Terminal ẩn" }
  ];

  const content = (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#0a0a0a', border: '2px solid #333', borderRadius: '8px',
        overflow: 'hidden', fontFamily: '"JetBrains Mono", monospace',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
        width: '100%', maxWidth: '700px',
        animation: 'status-blink 0.2s ease-out forwards'
      }}>
        {/* Terminal Header */}
        <div style={{
          background: '#1a1a1a', padding: '10px 16px', borderBottom: '1px solid #333',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={close} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Close"></button>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
          </div>
          <div style={{ color: '#888', fontSize: '12px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} /> guide.exe
          </div>
          <button onClick={close} style={{
            background: 'transparent', border: 'none', color: '#888', marginLeft: '12px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0
          }}>
            <X size={16} />
          </button>
        </div>
        
        {/* Terminal Body */}
        <div style={{ padding: '24px', color: '#a3a3a3', fontSize: '14px', lineHeight: '1.6' }}>
          <div style={{ color: '#fbbf24', marginBottom: '16px' }}>
            Welcome to HAIDANG.DEV! Initializing interactive modules... [OK]
          </div>
          <div style={{ color: '#10b981', marginBottom: '24px' }}>
            System ready. Following features are available for testing:
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <ChevronRight size={16} color="#3b82f6" style={{ marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{f.cmd}</span>
                  <br />
                  <span style={{ color: '#d4d4d4' }}>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>root@haidang.dev:~$</span>
              <span style={{ display: 'inline-block', width: '8px', height: '16px', background: '#d4d4d4', animation: 'status-blink 1s steps(1) infinite' }}></span>
            </div>
            <button onClick={close} style={{
              background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 16px',
              borderRadius: '4px', fontFamily: '"JetBrains Mono", monospace', fontSize: '12px',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
              [ BẮT ĐẦU ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
