import { useEffect, useRef } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    const pointerTarget = { x: 0.5, y: 0.5 };
    const pointer = { x: 0.5, y: 0.5 };
    let scrollTarget = window.scrollY || 0;
    let scrollValue = scrollTarget;

    function createParticle() {
      const depth = 0.4 + Math.random() * 1.2;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 2.3,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        depth,
        alpha: 0.2 + Math.random() * 0.55,
      };
    }

    function resetParticles() {
      const areaFactor = (width * height) / 18000;
      const count = prefersReducedMotion
        ? Math.max(22, Math.min(45, Math.floor(areaFactor * 0.35)))
        : Math.max(38, Math.min(95, Math.floor(areaFactor * 0.62)));

      particles = Array.from({ length: count }, createParticle);
    }

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetParticles();
    }

    function updatePointer(clientX, clientY) {
      pointerTarget.x = clamp(clientX / Math.max(width, 1), 0, 1);
      pointerTarget.y = clamp(clientY / Math.max(height, 1), 0, 1);
    }

    function handleMouseMove(event) {
      updatePointer(event.clientX, event.clientY);
    }

    function handleTouchMove(event) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      updatePointer(touch.clientX, touch.clientY);
    }

    function handleMouseLeave() {
      pointerTarget.x = 0.5;
      pointerTarget.y = 0.5;
    }

    function handleScroll() {
      scrollTarget = window.scrollY || 0;
    }

    function drawBackdrop(timestamp) {
      const t = timestamp * 0.001;

      const gradA = context.createRadialGradient(
        width * (0.2 + pointer.x * 0.28),
        height * 0.25,
        50,
        width * 0.2,
        height * 0.25,
        width * 0.78
      );
      gradA.addColorStop(0, 'rgba(66, 118, 255, 0.16)');
      gradA.addColorStop(1, 'rgba(66, 118, 255, 0)');

      const gradB = context.createRadialGradient(
        width * 0.85,
        height * (0.25 + pointer.y * 0.2),
        30,
        width * 0.85,
        height * 0.25,
        width * 0.6
      );
      gradB.addColorStop(0, 'rgba(255, 156, 103, 0.12)');
      gradB.addColorStop(1, 'rgba(255, 156, 103, 0)');

      const waveY = height * 0.66 + Math.sin(t * 0.8 + pointer.x * 3.2) * 14;
      context.fillStyle = gradA;
      context.fillRect(0, 0, width, height);
      context.fillStyle = gradB;
      context.fillRect(0, 0, width, height);

      context.beginPath();
      context.moveTo(-30, waveY);
      context.bezierCurveTo(width * 0.28, waveY - 28, width * 0.62, waveY + 32, width + 30, waveY - 8);
      context.lineTo(width + 30, height + 20);
      context.lineTo(-30, height + 20);
      context.closePath();
      context.fillStyle = 'rgba(77, 130, 255, 0.045)';
      context.fill();
    }

    function drawParticles() {
      const connectDistance = Math.min(140, width * 0.16);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(47, 103, 232, ${particle.alpha * 0.42})`;
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const other = particles[nextIndex];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);

          if (distance > connectDistance) {
            continue;
          }

          const lineAlpha = (1 - distance / connectDistance) * 0.16;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(71, 120, 236, ${lineAlpha})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    }

    function animate(timestamp) {
      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;
      scrollValue += (scrollTarget - scrollValue) * 0.08;

      context.clearRect(0, 0, width, height);
      drawBackdrop(timestamp);

      const scrollDrift = (scrollValue % Math.max(height, 1)) / Math.max(height, 1);
      const pointerDriftX = (pointer.x - 0.5) * 0.8;
      const pointerDriftY = (pointer.y - 0.5) * 0.8;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const speedScale = prefersReducedMotion ? 0.2 : 1;

        particle.x += (particle.vx + pointerDriftX * 0.09 * particle.depth) * speedScale;
        particle.y += (particle.vy + pointerDriftY * 0.09 * particle.depth + (scrollDrift - 0.5) * 0.18) * speedScale;

        if (particle.x < -28) {
          particle.x = width + 28;
        } else if (particle.x > width + 28) {
          particle.x = -28;
        }

        if (particle.y < -28) {
          particle.y = height + 28;
        } else if (particle.y > height + 28) {
          particle.y = -28;
        }
      }

      drawParticles();
      rafId = window.requestAnimationFrame(animate);
    }

    resizeCanvas();
    rafId = window.requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <canvas className="profile-shell__canvas" ref={canvasRef} aria-hidden="true" />;
}

export default BackgroundCanvas;
