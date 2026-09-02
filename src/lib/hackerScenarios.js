let ddosInterval;

export const hackerScenarios = [
  {
    id: 'ransomware',
    trigger: () => {
      document.body.classList.add('hacker-glitch');
      const overlay = document.createElement('div');
      overlay.id = 'hacker-ransomware-overlay';
      overlay.className = 'hacker-overlay-red';
      document.body.appendChild(overlay);
    },
    cleanup: () => {
      document.body.classList.remove('hacker-glitch');
      document.getElementById('hacker-ransomware-overlay')?.remove();
    },
    overlayWarning: '> CRITICAL ALERT: UNAUTHORIZED ACCESS DETECTED.\n> ENCRYPTING PORTFOLIO DATA... 14%... 32%...\n> GUEST_USER: PRESS [ ~ ] OR [_CMD] TO OPEN TERMINAL AND SECURE SYSTEM!',
    sequence: [
      {
        expected: 'scan',
        output: 'Scanning system... MALWARE FOUND (PID: 666)'
      },
      {
        expected: 'firewall --enable',
        output: 'Firewall activated. Isolating PID 666...'
      },
      {
        expected: 'kill 666',
        output: 'Process 666 terminated.'
      },
      {
        expected: 'restore',
        output: 'Decrypting data... 100%. SYSTEM SECURED.'
      }
    ]
  },
  {
    id: 'ddos',
    trigger: () => {
      document.body.classList.add('hacker-shake');
      let popupCount = 0;
      ddosInterval = setInterval(() => {
        if (popupCount > 50) return;
        const pop = document.createElement('div');
        pop.className = 'ddos-popup';
        pop.style.left = Math.random() * 80 + 'vw';
        pop.style.top = Math.random() * 80 + 'vh';
        pop.innerText = `[ATTACK] Request from ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.x.x`;
        document.body.appendChild(pop);
        popupCount++;
      }, 100);
    },
    cleanup: () => {
      document.body.classList.remove('hacker-shake');
      clearInterval(ddosInterval);
      document.querySelectorAll('.ddos-popup').forEach(el => el.remove());
    },
    overlayWarning: '> DDoS ATTACK IN PROGRESS. CPU OVERLOAD 99%.\n> SYSTEM LAG CRITICAL.\n> PRESS [ ~ ] TO INITIATE COUNTER-MEASURES.',
    sequence: [
      {
        expected: 'netstat',
        output: 'Active connections: 9,999,999 on PORT 4444.'
      },
      {
        expected: 'route drop port 4444',
        output: 'Traffic on PORT 4444 blocked.'
      },
      {
        expected: 'flush dns',
        output: 'DNS cache flushed. Clearing popups...'
      },
      {
        expected: 'reboot',
        output: 'System rebooted successfully. DDoS mitigated.'
      }
    ]
  },
  {
    id: 'rogue_ai',
    trigger: () => {
      document.body.classList.add('hacker-invert');
      // Create a hidden code element somewhere
      const code = document.createElement('div');
      code.id = 'rogue-ai-code';
      code.style.position = 'fixed';
      code.style.bottom = '10px';
      code.style.left = '10px';
      code.style.color = '#fff';
      code.style.background = '#000';
      code.style.padding = '4px';
      code.style.fontSize = '12px';
      code.style.zIndex = '99990';
      code.style.opacity = '0.7';
      code.innerText = 'OVERRIDE CODE: ALPHA-77';
      document.body.appendChild(code);
    },
    cleanup: () => {
      document.body.classList.remove('hacker-invert');
      document.getElementById('rogue-ai-code')?.remove();
    },
    overlayWarning: 'I AM SHADOW. THIS PORTFOLIO IS MINE NOW.\n> YOU HAVE NO CONTROL.\n> FIND THE OVERRIDE CODE HIDDEN ON THE SCREEN.',
    sequence: [
      {
        expected: 'whoami',
        output: 'You are nobody. I am in control.'
      },
      {
        expected: 'sudo override',
        output: 'ERROR: Override requires access code. Hint: Look in the bottom left corner.'
      },
      {
        expected: 'enter ALPHA-77',
        output: 'CODE ACCEPTED. AI purging...'
      }
    ]
  },
  {
    id: 'time_bomb',
    trigger: () => {
      const overlay = document.createElement('div');
      overlay.id = 'hacker-timebomb-overlay';
      overlay.className = 'hacker-overlay-yellow';
      document.body.appendChild(overlay);
      
      const timer = document.createElement('div');
      timer.id = 'hacker-timebomb-timer';
      timer.className = 'timebomb-timer';
      document.body.appendChild(timer);
    },
    cleanup: () => {
      document.getElementById('hacker-timebomb-overlay')?.remove();
      document.getElementById('hacker-timebomb-timer')?.remove();
    },
    overlayWarning: '> FATAL: MEMORY LEAK DETECTED. CORE MELTDOWN IMMINENT.\n> PRESS [ ~ ] TO DEFUSE THE BOMB.',
    sequence: [
      {
        expected: 'ps aux',
        output: 'USER   PID   COMMAND\nroot   1     init\nhacker 999   ./timebomb.sh'
      },
      {
        expected: 'debug timebomb.sh',
        output: 'Bomb defuse sequence requires reversing the string "Z8Y7X".'
      },
      {
        expected: 'defuse X7Y8Z',
        output: 'DEFUSE SEQUENCE ACCEPTED. Meltdown averted.'
      }
    ]
  }
];
