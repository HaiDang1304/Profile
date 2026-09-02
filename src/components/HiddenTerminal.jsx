import { useState, useEffect, useRef } from 'react';

export default function HiddenTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    "HAIDANG.DEV SYSTEM OS v1.0.0",
    "Type 'help' for a list of available commands.",
    ""
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on ~ (tilde) or backtick
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    const handleToggleEvent = () => setIsOpen(prev => !prev);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggleTerminal', handleToggleEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggleTerminal', handleToggleEvent);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [isOpen, history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, `C:\\HAIDANG> ${cmd}`];
      
      const args = cmd.toLowerCase().split(' ');
      const command = args[0];

      switch (command) {
        case '':
          break;
        case 'help':
          newHistory.push(
            "Available commands:",
            "  help     - Show this help message",
            "  about    - Display author information",
            "  skills   - List technical skills",
            "  clear    - Clear the terminal screen",
            "  exit     - Close the terminal",
            "  sudo     - Execute a command with superuser privileges"
          );
          break;
        case 'about':
          newHistory.push(
            "Hi, I'm Lu Hai Dang! A passionate Full-stack & IoT Developer.",
            "I love building interactive web apps and smart devices.",
            "Visit github.com/HaiDang1304 to see my work."
          );
          break;
        case 'skills':
          newHistory.push(
            "[Frontend]: React, Vite, HTML/CSS, Tailwind",
            "[Backend]: Node.js, Express, REST API",
            "[Database]: MySQL, Firebase",
            "[IoT]: ESP32, MQTT, C++"
          );
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'exit':
          setIsOpen(false);
          break;
        case 'sudo':
          if (args.join(' ') === 'sudo rm -rf /') {
            newHistory.push(
              "ACCESS DENIED.",
              "Nice try, but I won't let you delete my portfolio! ;)"
            );
          } else {
            newHistory.push("sudo: permission denied. You are not in the sudoers file.");
          }
          break;
        default:
          newHistory.push(`'${command}' is not recognized as an internal or external command.`);
      }
      
      newHistory.push("");
      setHistory(newHistory);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999,
      display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '80%', maxWidth: '700px', height: '400px',
        backgroundColor: '#000', border: '2px solid #333', borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px #444',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#222', padding: '8px 15px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '2px solid #333'
        }}>
          <span style={{ color: '#ccc', fontFamily: 'monospace', fontSize: '0.8rem' }}>C:\Windows\system32\cmd.exe</span>
          <button onClick={() => setIsOpen(false)} style={{
            background: '#ef4444', color: '#fff', border: 'none', width: '20px', height: '20px',
            borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px'
          }}>X</button>
        </div>
        
        <div 
          ref={terminalRef}
          onClick={() => inputRef.current?.focus()}
          style={{
            flex: 1, padding: '15px', backgroundColor: '#000', color: '#10b981', // Matrix green
            fontFamily: 'monospace', fontSize: '1rem', overflowY: 'auto',
            lineHeight: '1.5'
          }}
        >
          {history.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>C:\HAIDANG&gt;</span>
            <input 
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
              style={{
                background: 'transparent', border: 'none', color: '#10b981',
                fontFamily: 'monospace', fontSize: '1rem', flex: 1, outline: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
