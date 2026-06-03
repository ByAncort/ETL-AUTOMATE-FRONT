import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  phase: number;
}

export default function DataFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, mx: 0, my: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  const initParticles = useCallback((w: number, h: number) => {
    const count = 55;
    const p: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.3 + 0.2;
      p.push({
        x: w / 2 + Math.cos(angle) * w * dist * 0.45,
        y: h / 2 + Math.sin(angle) * w * dist * 0.35,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1.2 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
      dimsRef.current = { w, h };
      initParticles(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseleave', onMouseLeave);

    const draw = (ts: number) => {
      timeRef.current = ts / 1000;
      const { w, h } = dimsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // — gradient mesh background —
      const grad1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, w * 0.6);
      grad1.addColorStop(0, 'rgba(37,99,235,0.04)');
      grad1.addColorStop(0.5, 'rgba(99,102,241,0.03)');
      grad1.addColorStop(1, 'rgba(37,99,235,0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const grad2 = ctx.createRadialGradient(w * 0.8, h * 0.7, 0, w * 0.8, h * 0.7, w * 0.5);
      grad2.addColorStop(0, 'rgba(14,165,233,0.035)');
      grad2.addColorStop(0.6, 'rgba(99,102,241,0.025)');
      grad2.addColorStop(1, 'rgba(37,99,235,0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // subtle grid dots
      ctx.fillStyle = 'rgba(37,99,235,0.04)';
      const step = 40;
      const offsetX = (ts / 20000) * step % step;
      const offsetY = (ts / 25000) * step % step;
      for (let x = -step + offsetX; x < w + step; x += step) {
        for (let y = -step + offsetY; y < h + step; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // — update particles —
      const t = timeRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(t * 0.3 + p.phase) * 0.08;
        p.y += p.vy + Math.cos(t * 0.4 + p.phase * 1.3) * 0.08;

        const margin = 40;
        if (p.x < margin) p.x = margin;
        if (p.x > w - margin) p.x = w - margin;
        if (p.y < margin) p.y = margin;
        if (p.y > h - margin) p.y = h - margin;

        // mouse influence
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (1 - dist / 200) * 0.4;
          p.x += dx * force * 0.01;
          p.y += dy * force * 0.01;
        }
      }

      // — draw edges —
      const connectionDist = 130;
      const mouseConnDist = 220;
      const particleCount = particles.length;

      for (let i = 0; i < particleCount; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particleCount; j++) {
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
            ctx.lineWidth = 0.5 + (1 - dist / connectionDist) * 0.8;
            ctx.stroke();
          }
        }

        // connection to mouse
        if (mouse.x > 0) {
          const dx = mouse.x - a.x;
          const dy = mouse.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouseConnDist) {
            const alpha = (1 - dist / mouseConnDist) * 0.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // — draw particles —
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const pulse = 0.6 + Math.sin(t * 1.2 + p.phase) * 0.4;
        const radius = p.r * pulse;
        const alpha = 0.2 + pulse * 0.2;

        // glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
        grad.addColorStop(0, `rgba(37,99,235,${alpha * 0.3})`);
        grad.addColorStop(1, 'rgba(37,99,235,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - radius * 4, p.y - radius * 4, radius * 8, radius * 8);

        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${alpha + 0.1})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #f8fafc, #f0f4ff, #faf5ff)' }}
    />
  );
}
