import { useState, useEffect, useRef } from 'react';
import { hackerScenarios } from '../lib/hackerScenarios';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';

export default function HackerManager() {
  const [hackState, setHackState] = useState('IDLE'); // IDLE, HACKING, RESOLVED
  const [activeScenario, setActiveScenario] = useState(null);
  
  const timerRef = useRef(null);
  const timeLeftRef = useRef(60);

  useEffect(() => {
    const handleScroll = () => {
      if (hackState !== 'IDLE') return;
      if (window.scrollY > 1500) {
        triggerHack();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hackState]);

  const triggerHack = () => {
    let played = JSON.parse(localStorage.getItem('hacker_played') || '[]');
    let available = hackerScenarios.filter(s => !played.includes(s.id));
    
    // Reset if all played
    if (available.length === 0) {
      played = [];
      available = [...hackerScenarios];
    }

    const scenario = available[Math.floor(Math.random() * available.length)];
    setActiveScenario(scenario);
    setHackState('HACKING');
    
    // Dispatch to terminal
    window.dispatchEvent(new CustomEvent('hacker-event-start', { detail: scenario }));

    // Run trigger effects
    scenario.trigger();

    // Specific logic for time bomb
    if (scenario.id === 'time_bomb') {
      timeLeftRef.current = 60;
      timerRef.current = setInterval(() => {
        timeLeftRef.current -= 1;
        const timerEl = document.getElementById('hacker-timebomb-timer');
        if (timerEl) {
          const mins = Math.floor(timeLeftRef.current / 60).toString().padStart(2, '0');
          const secs = (timeLeftRef.current % 60).toString().padStart(2, '0');
          timerEl.innerText = `${mins}:${secs}`;
        }
        if (timeLeftRef.current <= 0) {
          clearInterval(timerRef.current);
          window.dispatchEvent(new CustomEvent('hacker-event-fail'));
        }
      }, 1000);
    }
  };

  useEffect(() => {
    const handleVictory = () => {
      if (activeScenario) {
        activeScenario.cleanup();
        if (timerRef.current) clearInterval(timerRef.current);
        
        const played = JSON.parse(localStorage.getItem('hacker_played') || '[]');
        localStorage.setItem('hacker_played', JSON.stringify([...played, activeScenario.id]));
        
        setHackState('RESOLVED');
        
        // Fireworks
        triggerFireworks();
        
        // Hide terminal after 3 seconds
        setTimeout(() => {
          setHackState('IDLE');
          setActiveScenario(null);
        }, 5000);
      }
    };

    const handleFail = () => {
      if (activeScenario) {
        activeScenario.cleanup();
        if (timerRef.current) clearInterval(timerRef.current);
        alert("GAME OVER. The portfolio was destroyed! (Just kidding, refreshing...)");
        window.location.reload();
      }
    };

    window.addEventListener('hacker-event-victory', handleVictory);
    window.addEventListener('hacker-event-fail', handleFail);
    return () => {
      window.removeEventListener('hacker-event-victory', handleVictory);
      window.removeEventListener('hacker-event-fail', handleFail);
    };
  }, [activeScenario]);

  const triggerFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  if (hackState === 'IDLE') return null;

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 99990, display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      {hackState === 'HACKING' && activeScenario && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)', border: '2px solid red', color: 'red',
          padding: '30px', maxWidth: '800px', textAlign: 'center',
          fontFamily: '"Press Start 2P", monospace', fontSize: '14px', lineHeight: '2',
          boxShadow: '0 0 50px rgba(255,0,0,0.5)', pointerEvents: 'auto',
          whiteSpace: 'pre-line'
        }}>
          {activeScenario.overlayWarning}
        </div>
      )}
      
      {hackState === 'RESOLVED' && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)', border: '2px solid #10b981', color: '#10b981',
          padding: '40px', maxWidth: '600px', textAlign: 'center',
          fontFamily: '"Press Start 2P", monospace', fontSize: '16px', lineHeight: '2',
          boxShadow: '0 0 50px rgba(16,185,129,0.5)', pointerEvents: 'auto',
          animation: 'scale-up 0.3s ease-out'
        }}>
          SYSTEM SECURED! <br/><br/>
          <span style={{fontSize: '12px', color: '#a3a3a3'}}>
            Cảm ơn bạn đã cứu Portfolio của Hải Đăng. Bạn đích thực là một Master Hacker!
          </span>
        </div>
      )}
    </div>,
    document.body
  );
}
