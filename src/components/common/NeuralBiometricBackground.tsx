import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
  pulseSpeed: number;
  type: 'neuron' | 'ecg_node' | 'abdm_hub' | 'vital_sensor';
}

interface SignalPulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const NeuralBiometricBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null; radius: number }>({
    x: null,
    y: null,
    radius: 175,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Deep Cyber Health Palette
    const palette = {
      bgGradient: ['#070D1E', '#0B132B', '#09182A'],
      nodes: ['#06D6A0', '#38BDF8', '#48CAE4', '#10B981', '#6EE7B7'],
      line: 'rgba(56, 189, 248, ',
      signalColor: '#06D6A0',
      ambientGlow: 'rgba(6, 214, 160, 0.16)',
      gridLine: 'rgba(56, 189, 248, 0.025)',
    };

    let particles: Particle[] = [];
    let signalPulses: SignalPulse[] = [];

    const initParticles = () => {
      particles = [];
      const particleDensity = Math.min(Math.floor((width * height) / 13500), 75);
      const types: Particle['type'][] = ['neuron', 'ecg_node', 'abdm_hub', 'vital_sensor'];

      for (let i = 0; i < particleDensity; i++) {
        const color = palette.nodes[Math.floor(Math.random() * palette.nodes.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const isHub = type === 'abdm_hub' || Math.random() < 0.18;
        const baseRadius = isHub ? Math.random() * 2.5 + 3.5 : Math.random() * 1.6 + 1.4;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          color,
          glowColor: color,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.025,
          type,
        });
      }
    };

    initParticles();

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Active Medical Data Signal Pulses
    const pulseInterval = setInterval(() => {
      if (particles.length > 2 && signalPulses.length < 14) {
        const fromIndex = Math.floor(Math.random() * particles.length);
        let closestIndex = -1;
        let minDistance = 175;
        for (let j = 0; j < particles.length; j++) {
          if (fromIndex === j) continue;
          const dx = particles[fromIndex].x - particles[j].x;
          const dy = particles[fromIndex].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
            closestIndex = j;
          }
        }

        if (closestIndex !== -1) {
          signalPulses.push({
            fromIndex,
            toIndex: closestIndex,
            progress: 0,
            speed: 0.02 + Math.random() * 0.025,
            color: palette.signalColor,
          });
        }
      }
    }, 380);

    // Animation Loop
    const render = () => {
      // Draw Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, palette.bgGradient[0]);
      bgGrad.addColorStop(0.5, palette.bgGradient[1]);
      bgGrad.addColorStop(1, palette.bgGradient[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Biometric Grid
      ctx.strokeStyle = palette.gridLine;
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const maxDistance = 150;

      // Update Particles & Draw Mesh Lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse connection & gentle magnetic force
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const mdx = p1.x - mouseRef.current.x;
          const mdy = p1.y - mouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouseRef.current.radius) {
            const force = (1 - mDist / mouseRef.current.radius) * 1.6;
            p1.x += (mdx / mDist) * force * 1.8;
            p1.y += (mdy / mDist) * force * 1.8;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `${palette.line}${0.5 * (1 - mDist / mouseRef.current.radius)})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }

        p1.pulsePhase += p1.pulseSpeed;
        p1.radius = p1.baseRadius + Math.sin(p1.pulsePhase) * 0.7;

        // Inter-node connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${palette.line}${opacity})`;
            ctx.lineWidth = dist < 70 ? 1.3 : 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw Signal Pulses
      for (let s = signalPulses.length - 1; s >= 0; s--) {
        const pulse = signalPulses[s];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          signalPulses.splice(s, 1);
          continue;
        }

        const pFrom = particles[pulse.fromIndex];
        const pTo = particles[pulse.toIndex];
        if (!pFrom || !pTo) {
          signalPulses.splice(s, 1);
          continue;
        }

        const currX = pFrom.x + (pTo.x - pFrom.x) * pulse.progress;
        const currY = pFrom.y + (pTo.y - pFrom.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(currX, currY, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes with Halos
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = palette.ambientGlow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.type === 'abdm_hub') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(6, 214, 160, 0.4)';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(pulseInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/50 pointer-events-none" />
    </div>
  );
};
