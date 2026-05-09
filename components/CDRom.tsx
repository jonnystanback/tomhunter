"use client";

import { useEffect, useMemo, useRef } from "react";

type Dot = { x: number; y: number };

function buildDots(): Dot[] {
  const dots: Dot[] = [];
  const innerR = 0.24;
  const rings = 34;
  for (let r = 0; r < rings; r++) {
    const t = r / (rings - 1);
    const radius = innerR + (1 - innerR) * t;
    const circumference = 2 * Math.PI * radius;
    const count = Math.max(24, Math.round(circumference * 42));
    const phase = r * 0.17;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + phase;
      dots.push({ x: Math.cos(a) * radius, y: Math.sin(a) * radius });
    }
  }
  return dots;
}

export function CDRom({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useMemo(buildDots, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const heroEl = canvas.closest("section") as HTMLElement | null;

    let raf = 0;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) / 2 - 4;

      const y = window.scrollY;
      // Progress through the hero section (0 = hero top, 1 = hero scrolled past)
      const winH = window.innerHeight;
      const heroH = heroEl?.offsetHeight ?? winH;
      const heroSpan = Math.max(1, heroH - winH * 0.4);
      const p = Math.max(0, Math.min(1, y / heroSpan));
      // Reverse: maxed at top, settles at bottom
      const r = 1 - p;
      // Slow idle spin (full rotation every ~30s) + scroll-driven reverse
      const idleSpin = (performance.now() * 0.012 * Math.PI) / 180;
      const spin = idleSpin + (-r * 1080 * Math.PI) / 180;
      // Tilt large at top, settles to gentle base as you scroll
      const tiltDeg = 20 + r * 40 + Math.sin(y * 0.006) * 6;
      const tilt = (tiltDeg * Math.PI) / 180;
      // Yaw active at top, quiet at bottom
      const yawDeg = r * 25 + Math.sin(y * 0.004) * 6;
      const yaw = (yawDeg * Math.PI) / 180;
      // Constant dot size — midpoint of previous min/max range
      // Scale dot size with canvas width so mobile dots aren't oversized
      const sizeMul = Math.max(0.5, Math.min(1.6, w / 320));

      const cT = Math.cos(tilt);
      const sT = Math.sin(tilt);
      const cS = Math.cos(spin);
      const sS = Math.sin(spin);
      const cY = Math.cos(yaw);
      const sY = Math.sin(yaw);

      // Fixed cream color (does not flip with theme) — paired with
      // mix-blend-mode: difference, this gives dark dots on light bg
      // and light dots on dark bg, while preserving the text-exclusion blend.
      ctx.fillStyle = "rgb(239, 234, 224)";

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // Z-spin (in disc plane)
        const x1 = d.x * cS - d.y * sS;
        const y1 = d.x * sS + d.y * cS;
        // X-tilt
        const x2 = x1;
        const y2 = y1 * cT;
        const z2 = y1 * sT;
        // Y-yaw
        const x3 = x2 * cY + z2 * sY;
        const z3 = -x2 * sY + z2 * cY;
        const y3 = y2;

        const sx = cx + x3 * R;
        const sy = cy + y3 * R;
        const depth = (z3 + 1) * 0.5;
        const sz = (1.5 - depth * 0.55) * sizeMul;
        ctx.beginPath();
        ctx.arc(sx, sy, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [dots]);

  return (
    <canvas
      ref={canvasRef}
      className={`cd-rom-canvas pointer-events-none select-none ${className}`}
      style={style}
      aria-hidden
    />
  );
}
