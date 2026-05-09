"use client";

import { useEffect, useMemo, useState } from "react";

type Dot = { x: number; y: number; r: number };

function buildDots(): Dot[] {
  const out: Dot[] = [];
  const rings = 9;
  const inner = 0.3;
  for (let r = 0; r < rings; r++) {
    const t = r / (rings - 1);
    const radius = inner + (1 - inner) * t;
    const count = 28 + r * 6;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + r * 0.18;
      out.push({
        x: Math.cos(a) * radius,
        y: Math.sin(a) * radius,
        r: 1.5,
      });
    }
  }
  return out;
}

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const dots = useMemo(buildDots, []);

  useEffect(() => {
    setMounted(true);
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const loop = () => {
      const t = Math.min(1, (performance.now() - start) / duration);
      setProgress(t);
      if (t < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        document.body.classList.add("loaded");
        setTimeout(() => setDone(true), 800);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted || done) return null;

  const pct = Math.floor(progress * 100);
  const ticks = 52;
  const filled = Math.floor(progress * ticks);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-cream text-ink font-mono select-none transition-opacity duration-[800ms] ease-out ${
        progress >= 1 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ letterSpacing: 0 }}
      aria-hidden
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
        <svg
          viewBox="-100 -100 200 200"
          className="size-28 sm:size-36 cd-spin"
        >
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x * 88}
              cy={d.y * 88}
              r={d.r}
              fill="rgb(var(--ink))"
            />
          ))}
          <circle
            cx={0}
            cy={0}
            r={20}
            fill="rgb(var(--cream))"
            stroke="rgb(var(--ink))"
            strokeWidth={0.6}
          />
          <circle
            cx={0}
            cy={0}
            r={6}
            fill="rgb(var(--cream))"
            stroke="rgb(var(--ink))"
            strokeWidth={0.4}
          />
        </svg>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-[2px]">
            {Array.from({ length: ticks }).map((_, i) => (
              <div
                key={i}
                className={`w-[2px] h-2 transition-colors ${
                  i < filled ? "bg-ink" : "bg-ink/15"
                }`}
              />
            ))}
          </div>
          <div className="text-[9px] tracking-widest tabular-nums">
            {pct.toString().padStart(3, "0")}%
          </div>
        </div>
      </div>
    </div>
  );
}
