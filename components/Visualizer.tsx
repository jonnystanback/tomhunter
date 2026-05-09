"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "./PlayerProvider";

export function Visualizer({ height = 56 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { freq, isPlaying } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const bins = freq ? Math.min(freq.length, 220) : 220;
      const barW = 3;
      const total = w;
      const step = total / bins;
      const cy = h / 2;

      const ink = getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim();
      ctx.lineCap = "round";
      ctx.lineWidth = barW;
      ctx.strokeStyle = `rgb(${ink})`;

      for (let i = 0; i < bins; i++) {
        const v = freq ? freq[i] / 255 : 0;
        const idle = isPlaying
          ? 0
          : 0.05 + Math.sin(Date.now() / 600 + i * 0.5) * 0.04;
        const amp = Math.max(idle, v);
        const bh = Math.max(barW, amp * (h - barW));
        const x = step * i + step / 2;
        ctx.beginPath();
        ctx.moveTo(x, cy - bh / 2);
        ctx.lineTo(x, cy + bh / 2);
        ctx.stroke();
      }
    };

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [freq, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height, width: "100%", display: "block" }}
      aria-hidden
    />
  );
}
