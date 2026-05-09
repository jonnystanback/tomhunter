function DotDisc({ size = 36 }: { size?: number }) {
  const dots: { x: number; y: number }[] = [];
  const rings = 4;
  const innerR = 0.34;
  for (let r = 0; r < rings; r++) {
    const t = r / (rings - 1);
    const radius = innerR + (1 - innerR) * t;
    const count = 12 + r * 4;
    const phase = r * 0.18;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + phase;
      dots.push({
        x: Math.cos(a) * radius,
        y: Math.sin(a) * radius,
      });
    }
  }
  return (
    <svg viewBox="-1 -1 2 2" width={size} height={size} aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={0.06} fill="currentColor" />
      ))}
      <circle cx={0} cy={0} r={0.1} fill="currentColor" />
    </svg>
  );
}

function StarBurst({ size = 36 }: { size?: number }) {
  const points = 8;
  return (
    <svg viewBox="-1 -1 2 2" width={size} height={size} aria-hidden>
      {Array.from({ length: points }).map((_, i) => {
        const a = (i / points) * Math.PI * 2;
        const long = i % 2 === 0 ? 0.92 : 0.5;
        return (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={Math.cos(a) * long}
            y2={Math.sin(a) * long}
            stroke="currentColor"
            strokeWidth={0.07}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={0} cy={0} r={0.12} fill="currentColor" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="px-4 sm:px-8 pt-10 pb-6 text-ink">
      <div className="max-w-6xl mx-auto flex items-end justify-between gap-4">
        <DotDisc size={36} />

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="font-display text-[1rem] sm:text-[1.1rem] uppercase leading-none">
            Tom Hunter
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-widest uppercase text-ink/60 tabular-nums">
            © 2026 · Producer · EST 2018
          </div>
        </div>

        <StarBurst size={36} />
      </div>
    </footer>
  );
}
