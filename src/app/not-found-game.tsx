'use client';

import { useEffect, useRef } from 'react';

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

  // Store all game loop state in refs to prevent React state closure tearing
  const gameState = useRef({
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
  const spawnTimerRef = useRef<number>(0);

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height - 24;
    groundYRef.current = groundY;
    playerRef.current = {
      x: 48,
      y: groundY - 34,
      w: 34,
      h: 34,
      vy: 0,
      jumping: false,
    };
    obstaclesRef.current = [];
    spawnTimerRef.current = 0;
    gameState.current = {
      running: true,
      over: false,
      score: 0,
      speed: 5.5,
    };
  };

  const jump = () => {
    const g = gameState.current;
    const p = playerRef.current;

    if (!g.running || g.over) {
      reset();
      return;
    }

    if (!p.jumping) {
      p.vy = -14.5;
      p.jumping = true;
    }
  };

  const spawnObstacle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = groundYRef.current;
    const isBird = Math.random() < 0.3 && gameState.current.score > 50;
    const type = isBird ? 'bird' : 'cactus';
    const h = type === 'cactus' ? 32 : 22;
    const y = type === 'cactus' ? groundY - h : groundY - h - 25 - Math.random() * 25;
    obstaclesRef.current.push({
      x: canvas.width + 16,
      y,
      w: type === 'cactus' ? 18 : 28,
      h,
      type,
    });
  };

  const update = (dt: number) => {
    const g = gameState.current;
    if (!g.running || g.over) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const safeDt = Math.min(Math.max(dt, 1), 50); // clamp dt to avoid huge jumps on tab switch
    const p = playerRef.current;
    const gravity = 0.78;

    p.vy! += gravity;
    p.y += p.vy!;
    if (p.y >= groundYRef.current - p.h) {
      p.y = groundYRef.current - p.h;
      p.vy = 0;
      p.jumping = false;
    }

    // Move obstacles
    const obs = obstaclesRef.current;
    for (let i = obs.length - 1; i >= 0; i--) {
      obs[i].x -= g.speed;
      if (obs[i].x + obs[i].w < -20) {
        obs.splice(i, 1);
      }
    }

    // Spawn logic with minimum intervals
    spawnTimerRef.current += safeDt;
    const spawnInterval = Math.max(1400 - g.score * 2, 750);
    if (spawnTimerRef.current > spawnInterval) {
      spawnObstacle();
      spawnTimerRef.current = 0;
    }

    // Collision detection (with 4px forgiveness padding)
    for (const o of obs) {
      const collision =
        p.x + 4 < o.x + o.w - 4 &&
        p.x + p.w - 4 > o.x + 4 &&
        p.y + 4 < o.y + o.h &&
        p.y + p.h > o.y + 4;

      if (collision) {
        g.over = true;
        g.running = false;
        return;
      }
    }

    // Smooth score accumulation
    g.score += safeDt * 0.06;
    g.speed = Math.min(5.5 + g.score * 0.004, 12);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const groundY = groundYRef.current;
    const g = gameState.current;

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
    ctx.fillStyle = g.over ? '#ef4444' : '#1e293b';
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 6);
    ctx.fill();

    // Player eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(p.x + p.w - 10, p.y + 7, 5, 5);

    // Obstacles
    for (const o of obstaclesRef.current) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(o.x, o.y, o.w, o.h, 4);
      ctx.fill();
    }

    // Score during active gameplay (live updating)
    if (g.running && !g.over) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 15px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Score: ${Math.floor(g.score)}`, w - 18, 30);
    }

    // Overlays
    if (g.over) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.fillRect(0, 0, w, h);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('Game Over', w / 2, h / 2 - 20);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 15px system-ui, sans-serif';
      ctx.fillText(`Score: ${Math.floor(g.score)}`, w / 2, h / 2 + 8);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Press Space or tap to restart', w / 2, h / 2 + 36);
    } else if (!g.running) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
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
    if (!lastTimeRef.current) lastTimeRef.current = time;
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
      groundYRef.current = canvas.height - 24;
      if (!gameState.current.running && !gameState.current.over) {
        playerRef.current = {
          x: 48,
          y: groundYRef.current - 34,
          w: 34,
          h: 34,
          vy: 0,
          jumping: false,
        };
      }
      draw();
    };

    resize();
    window.addEventListener('resize', resize);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      jump();
    };

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', onKey);
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    canvas.addEventListener('mousedown', onClick);

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('mousedown', onClick);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[540px] h-[180px] rounded-xl border border-border/40 bg-muted/20 shadow-sm touch-manipulation select-none cursor-pointer"
      aria-label="Agent Runner - tap/click/space to jump over obstacles"
      role="application"
    />
  );
}