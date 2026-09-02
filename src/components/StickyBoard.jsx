import { Terminal, ChevronRight } from 'lucide-react';

export default function StickyBoard() {
  const features = [
    { cmd: "sys.get('avatar')", desc: "Tự thiết kế Pixel Avatar ở cuối trang" },
    { cmd: "sys.trigger('reaction')", desc: "Thả cảm xúc tương tác vào các dự án" },
    { cmd: "sys.spawn('bug')", desc: "Đập những con bọ chạy ngang màn hình để nhận điểm" },
    { cmd: "sys.note('double_click')", desc: "Nhấp đúp chuột vào bất kỳ đâu để dán Sticky Note" },
    { cmd: "sys.toggle('spotlight')", desc: "Bật chế độ đèn pin (góc dưới bên trái màn hình)" },
    { cmd: "sys.quest('easter_egg')", desc: "Tìm 5 viên ngọc ẩn để kích hoạt pháo hoa" },
    { cmd: "sys.open('terminal')", desc: "Bấm phím `~` để mở Terminal ẩn" }
  ];

  return (
    <section className="content-section" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <div className="section-grid">
        <div className="section-heading reveal">
          <span className="section-tag">SYSTEM_INFO</span>
          <h2>Hướng Dẫn Tương Tác</h2>
          <p>Portfolio này không chỉ để đọc! Hãy thử nghiệm các tính năng ẩn bên dưới nhé:</p>
        </div>
        
        <div className="reveal" style={{
          background: '#0a0a0a',
          border: '2px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
          fontFamily: '"JetBrains Mono", monospace',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          maxWidth: '800px'
        }}>
          {/* Terminal Header */}
          <div style={{
            background: '#1a1a1a',
            padding: '10px 16px',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <div style={{ 
              color: '#888', 
              fontSize: '12px', 
              marginLeft: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <Terminal size={14} /> guide.exe
            </div>
          </div>
          
          {/* Terminal Body */}
          <div style={{ padding: '24px', color: '#a3a3a3', fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ color: '#fbbf24', marginBottom: '16px' }}>
              Initializing interactive modules... [OK]
            </div>
            <div style={{ color: '#10b981', marginBottom: '24px' }}>
              System ready. Following features are available:
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

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>root@haidang.dev:~$</span>
              <span style={{ 
                display: 'inline-block', 
                width: '8px', 
                height: '16px', 
                background: '#d4d4d4',
                animation: 'status-blink 1s steps(1) infinite'
              }}></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
