'use client';

import { useEffect, useRef, useState } from 'react';

interface GameState {
  running: boolean;
  over: boolean;
  score: number;
  speed: number;
}

interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'cactus' | 'bird';
  vy?: number;
  jumping?: boolean;
}

export function NotFoundGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<GameState>({
    running: false,
    over: false,
    score: 0,
    speed: 6,
  });

  const playerRef = useRef<Entity>({ x: 0, y: 0, w: 0, h: 0, vy: 0, jumping: false });
  const obstaclesRef = useRef<Entity[]>([]);
  const groundYRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height - 24;
    groundYRef.current = groundY;
    playerRef.current = {
      x: 48,
      y: groundY - 36,
      w: 36,
      h: 36,
      vy: 0,
      jumping: false,
    };
    obstaclesRef.current = [];
    setState({ running: true, over: false, score: 0, speed: 6 });
  };

  const jump = () => {
    const p = playerRef.current;
    if (!p.jumping && state.running && !state.over) {
      p.vy = -16;
      p.jumping = true;
    }
    if (state.over || !state.running) reset();
  };

  const spawnObstacle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = groundYRef.current;
    const type = Math.random() < 0.7 ? 'cactus' : 'bird';
    const h = type === 'cactus' ? 36 : 24;
    const y = type === 'cactus' ? groundY - h : groundY - h - Math.random() * 32;
    obstaclesRef.current.push({
      x: canvas.width + 20,
      y,
      w: type === 'cactus' ? 18 : 32,
      h,
      type,
    });
  };

  const update = (dt: number) => {
    if (!state.running || state.over) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const p = playerRef.current;
    const gravity = 0.85;

    p.vy! += gravity;
    p.y += p.vy!;
    if (p.y >= groundYRef.current - p.h) {
      p.y = groundYRef.current - p.h;
      p.vy = 0;
      p.jumping = false;
    }

    const obs = obstaclesRef.current;
    for (let i = obs.length - 1; i >= 0; i--) {
      obs[i].x -= state.speed;
      if (obs[i].x + obs[i].w < 0) {
        obs.splice(i, 1);
      }
    }

    if (Math.random() < 0.015) spawnObstacle();

    for (const o of obs) {
      if (
        playerRef.current.x < o.x + o.w &&
        playerRef.current.x + playerRef.current.w > o.x &&
        playerRef.current.y < o.y + o.h &&
        playerRef.current.y + playerRef.current.h > o.y
      ) {
        setState(s => ({ ...s, over: true, running: false }));
        return;
      }
    }

    setState(s => ({
      ...s,
      score: s.score + dt * 0.1,
      speed: Math.min(6 + s.score * 0.0005, 13),
    }));
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const groundY = groundYRef.current;

    ctx.clearRect(0, 0, w, h);

    // Ground line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Player
    const p = playerRef.current;
    ctx.fillStyle = state.over ? '#ef4444' : '#1e293b';
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 6);
    ctx.fill();

    // Player eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x + p.w - 12, p.y + 8, 6, 6);

    // Obstacles
    for (const o of obstaclesRef.current) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(o.x, o.y, o.w, o.h, 4);
      ctx.fill();
    }

    // Active score in top right
    if (state.running && !state.over) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 16px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.floor(state.score).toString(), w - 20, 32);
    }

    // Center overlays
    if (state.over) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, 0, w, h);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('Game Over', w / 2, h / 2 - 20);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 15px system-ui, sans-serif';
      ctx.fillText(`Score: ${Math.floor(state.score)}`, w / 2, h / 2 + 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Press Space or tap to restart', w / 2, h / 2 + 36);
    } else if (!state.running) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, 0, w, h);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('Agent Runner', w / 2, h / 2 - 20);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 14px system-ui, sans-serif';
      ctx.fillText('Jump over obstacles to survive', w / 2, h / 2 + 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Press Space or tap to start', w / 2, h / 2 + 36);
    }
  };

  const loop = (time: number) => {
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;
    update(dt);
    draw();
    frameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const targetWidth = Math.max(Math.min(rect.width, 540), 280);
      canvas.width = targetWidth;
      canvas.height = 180;
      if (!state.running && !state.over) reset();
      draw();
    };
    resize();
    window.addEventListener('resize', resize);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    const onTouch = (e: TouchEvent) => {
      if (state.running || state.over) {
        e.preventDefault();
      }
      jump();
    };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        jump();
      }
    };

    window.addEventListener('keydown', onKey);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('click', onClick);

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('click', onClick);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [state.running, state.over]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[540px] h-[180px] rounded-xl border border-border/40 bg-muted/20 shadow-sm touch-manipulation select-none"
      aria-label="Agent Runner - tap/click/space to jump over obstacles"
      role="application"
    />
  );
}