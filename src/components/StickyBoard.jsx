import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';

export default function StickyBoard() {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState(null);
  const boardRef = useRef(null);

  useEffect(() => {
    apiRequest('/notes').then(data => setNotes(data || [])).catch(console.error);
  }, []);

  const handleBoardClick = (e) => {
    // Only spawn draft if clicking directly on board (not a note)
    if (e.target !== boardRef.current) return;
    if (draft) { setDraft(null); return; } // cancel draft
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDraft({ x, y, text: '', color: '#fef08a' }); // default yellow
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!draft || !draft.text.trim()) { setDraft(null); return; }
    
    try {
      const newNote = await apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify(draft)
      });
      setNotes(prev => [...prev, newNote]);
      setDraft(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="content-section" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="section-grid">
        <div className="section-heading reveal">
          <span className="section-tag">COMMUNITY</span>
          <h2>Bảng Ghi Chú (Sticky Notes)</h2>
          <p>Nhấn vào bất kỳ đâu trên bảng để dán một tờ giấy note nhé!</p>
        </div>
        
        <div 
          ref={boardRef}
          onClick={handleBoardClick}
          style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            backgroundColor: '#854d0e', // corkboard color
            backgroundImage: 'radial-gradient(#713f12 15%, transparent 16%), radial-gradient(#713f12 15%, transparent 16%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            borderRadius: '8px',
            border: '8px solid #451a03',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            cursor: draft ? 'default' : 'crosshair'
          }}
        >
          {notes.map(note => (
            <div key={note.id} style={{
              position: 'absolute',
              left: note.x,
              top: note.y,
              width: '120px',
              backgroundColor: note.color,
              padding: '10px',
              boxShadow: '2px 4px 6px rgba(0,0,0,0.3)',
              transform: `rotate(${(note.id * 13) % 10 - 5}deg)`,
              color: '#000',
              fontFamily: 'sans-serif',
              fontSize: '0.85rem',
              wordWrap: 'break-word'
            }}>
              <div style={{
                position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444',
                boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3)'
              }} />
              {note.text}
            </div>
          ))}

          {draft && (
            <form onSubmit={handleSaveDraft} style={{
              position: 'absolute', left: draft.x, top: draft.y, width: '140px',
              backgroundColor: draft.color, padding: '10px', boxShadow: '4px 8px 12px rgba(0,0,0,0.4)',
              zIndex: 10
            }}>
              <textarea 
                autoFocus
                value={draft.text}
                onChange={e => setDraft({...draft, text: e.target.value})}
                placeholder="Viết gì đó..."
                style={{ width: '100%', height: '60px', border: 'none', background: 'transparent', color: '#000', outline: 'none', resize: 'none' }}
              />
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {['#fef08a', '#fecaca', '#bfdbfe', '#bbf7d0'].map(c => (
                  <button type="button" key={c} onClick={() => setDraft({...draft, color: c})} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: draft.color === c ? '2px solid #000' : 'none', cursor: 'pointer' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setDraft(null)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.7rem' }}>Hủy</button>
                <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '2px 6px', cursor: 'pointer', fontSize: '0.7rem' }}>Dán</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
