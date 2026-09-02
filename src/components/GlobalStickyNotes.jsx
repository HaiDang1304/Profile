import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { apiRequest } from '../lib/api';

export default function GlobalStickyNotes() {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    apiRequest('/notes').then(data => setNotes(data || [])).catch(console.error);

    const handleDblClick = (e) => {
      // Don't trigger if clicking inside a note or interactive elements
      if (e.target.closest('.sticky-note-item') || e.target.closest('button') || e.target.closest('a')) return;
      
      const x = e.pageX;
      const y = e.pageY;
      setDraft({ x, y, text: '', color: '#fef08a' });
    };

    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, []);

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

  const content = (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 40 }}>
      {notes.map(note => (
        <div className="sticky-note-item" key={note.id} style={{
          position: 'absolute',
          left: note.x,
          top: note.y,
          width: '130px',
          backgroundColor: note.color,
          padding: '12px',
          boxShadow: '3px 6px 12px rgba(0,0,0,0.4)',
          transform: `rotate(${(note.id * 13) % 12 - 6}deg)`,
          color: '#000',
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          fontSize: '0.9rem',
          wordWrap: 'break-word',
          pointerEvents: 'auto',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          zIndex: 41
        }}
        onMouseEnter={e => e.currentTarget.style.transform = `rotate(0deg) scale(1.1)`}
        onMouseLeave={e => e.currentTarget.style.transform = `rotate(${(note.id * 13) % 12 - 6}deg) scale(1)`}
        >
          <div style={{
            position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)',
            width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444',
            boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.4)'
          }} />
          {note.text}
        </div>
      ))}

      {draft && (
        <form className="sticky-note-item" onSubmit={handleSaveDraft} style={{
          position: 'absolute', left: draft.x, top: draft.y, width: '150px',
          backgroundColor: draft.color, padding: '12px', boxShadow: '4px 8px 16px rgba(0,0,0,0.5)',
          zIndex: 50, pointerEvents: 'auto', transform: 'rotate(-2deg)'
        }}>
          <textarea 
            autoFocus
            value={draft.text}
            onChange={e => setDraft({...draft, text: e.target.value})}
            placeholder="Ghi chú gì đó..."
            style={{ width: '100%', height: '70px', border: 'none', background: 'transparent', color: '#000', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {['#fef08a', '#fecaca', '#bfdbfe', '#bbf7d0', '#e9d5ff'].map(c => (
              <button type="button" key={c} onClick={() => setDraft({...draft, color: c})} style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, border: draft.color === c ? '2px solid #000' : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="button" onClick={() => setDraft(null)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', marginRight: '8px' }}>Hủy</button>
            <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Dán</button>
          </div>
        </form>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
