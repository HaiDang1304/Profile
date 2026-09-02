import { useState, useEffect, useRef } from 'react';

export default function HiddenTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    "HAIDANG.DEV SYSTEM OS v1.0.0",
    "Type 'help' for a list of available commands.",
    ""
  ]);
  const [input, setInput] = useState('');
  
  // Auth state machine: 'idle' | 'username' | 'password'
  const [authState, setAuthState] = useState('idle');
  const [tempUser, setTempUser] = useState('');

  // Hacker Minigame state
  const [hackerScenario, setHackerScenario] = useState(null);
  const [hackerStep, setHackerStep] = useState(0);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    const handleToggleEvent = () => setIsOpen(prev => !prev);
    
    const onHackerStart = (e) => {
      setHackerScenario(e.detail);
      setHackerStep(0);
      setIsOpen(true);
      setHistory(prev => [
        ...prev,
        "",
        "==========================================",
        "!!! SYSTEM COMPROMISED !!!",
        "EMERGENCY PROTOCOL ACTIVATED.",
        "Waiting for counter-measure commands...",
        "==========================================",
        ""
      ]);
    };

    const onHackerFail = () => {
      setHackerScenario(null);
      setIsOpen(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggleTerminal', handleToggleEvent);
    window.addEventListener('hacker-event-start', onHackerStart);
    window.addEventListener('hacker-event-fail', onHackerFail);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggleTerminal', handleToggleEvent);
      window.removeEventListener('hacker-event-start', onHackerStart);
      window.removeEventListener('hacker-event-fail', onHackerFail);
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

  const handleCommand = async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      
      let promptPrefix = hackerScenario ? "root@compromised:~# " : "C:\\HAIDANG> ";
      if (authState === 'username') promptPrefix = "Username: ";
      if (authState === 'password') promptPrefix = "Password: ";

      const displayCmd = authState === 'password' ? '*'.repeat(cmd.length) : cmd;
      const newHistory = [...history, `${promptPrefix}${displayCmd}`];
      
      setInput('');

      // HACKER MODE INTERCEPT
      if (hackerScenario) {
        if (!cmd) {
          setHistory(newHistory);
          return;
        }
        const expected = hackerScenario.sequence[hackerStep].expected;
        if (cmd.toLowerCase() === expected.toLowerCase()) {
          newHistory.push(hackerScenario.sequence[hackerStep].output);
          const nextStep = hackerStep + 1;
          setHackerStep(nextStep);
          if (nextStep >= hackerScenario.sequence.length) {
            newHistory.push("", "ALL THREATS NEUTRALIZED.");
            window.dispatchEvent(new CustomEvent('hacker-event-victory'));
            setHackerScenario(null);
            setTimeout(() => setIsOpen(false), 4000);
          }
        } else {
          newHistory.push(`Command unrecognized or incorrect sequence. Expected counter-measure: '${expected}'`);
        }
        setHistory(newHistory);
        return;
      }

      if (authState === 'username') {
        if (!cmd) {
          setAuthState('idle');
          newHistory.push("Login cancelled.", "");
        } else {
          setTempUser(cmd);
          setAuthState('password');
        }
        setHistory(newHistory);
        return;
      }

      if (authState === 'password') {
        setAuthState('idle');
        newHistory.push("Authenticating...");
        setHistory(newHistory);
        
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: tempUser, password: cmd })
          });
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem('portfolio-admin-token', data.token);
            if (data.admin) localStorage.setItem('portfolio-admin-user', JSON.stringify(data.admin));
            setHistory(prev => [...prev, "Authentication successful. Redirecting to admin panel..."]);
            setTimeout(() => {
              window.location.href = '/admin';
            }, 1000);
          } else {
            setHistory(prev => [...prev, "Access Denied: " + (data.error || "Invalid credentials"), ""]);
          }
        } catch(err) {
           setHistory(prev => [...prev, "Network error.", ""]);
        }
        return;
      }

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
            "  login    - Authenticate as system administrator",
            "  exit     - Close the terminal",
            "  sudo     - Execute a command with superuser privileges"
          );
          break;
        case 'login':
          setAuthState('username');
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
      
      if (command !== 'login') {
         newHistory.push("");
      }
      setHistory(newHistory);
    }
  };

  if (!isOpen) return null;

  let currentPrompt = hackerScenario ? "root@compromised:~# " : "C:\\HAIDANG>";
  if (authState === 'username') currentPrompt = "Username:";
  if (authState === 'password') currentPrompt = "Password:";

  const terminalColor = hackerScenario ? '#ef4444' : '#10b981'; // Red when hacked, green normally

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999,
      display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '80%', maxWidth: '700px', height: '400px',
        backgroundColor: '#000', border: hackerScenario ? '2px solid #ef4444' : '2px solid #333', borderRadius: '8px',
        boxShadow: hackerScenario ? '0 10px 50px rgba(239, 68, 68, 0.4), 0 0 0 1px #ef4444' : '0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px #444',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: hackerScenario ? 'hacker-shake-anim 0.5s infinite' : 'none'
      }}>
        <div style={{
          backgroundColor: hackerScenario ? '#450a0a' : '#222', padding: '8px 15px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: hackerScenario ? '2px solid #ef4444' : '2px solid #333'
        }}>
          <span style={{ color: hackerScenario ? '#ef4444' : '#ccc', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: hackerScenario ? 'bold' : 'normal' }}>
            {hackerScenario ? 'EMERGENCY_OVERRIDE_TERMINAL' : 'C:\\Windows\\system32\\cmd.exe'}
          </span>
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
            flex: 1, padding: '15px', backgroundColor: '#000', color: terminalColor,
            fontFamily: 'monospace', fontSize: '1rem', overflowY: 'auto',
            lineHeight: '1.5'
          }}
        >
          {history.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>{currentPrompt}</span>
            <input 
              ref={inputRef}
              type={authState === 'password' ? 'password' : 'text'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
              style={{
                background: 'transparent', border: 'none', color: terminalColor,
                fontFamily: 'monospace', fontSize: '1rem', flex: 1, outline: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
