"use client";

import { formatStreams } from "@/lib/format";
import { CDRom } from "./CDRom";

export function ReactiveHero({
  trackCount,
  totalStreams,
}: {
  trackCount: number;
  totalStreams: number;
}) {
  return (
    <section className="relative overflow-hidden px-4 sm:px-8 pt-10 sm:pt-20 pb-4 sm:pb-8">
      <div className="relative max-w-6xl mx-auto">
        <CDRom className="appear" style={{ animationDelay: "850ms" }} />
        <div className="relative z-10">
        <div
          className="appear text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ink/50 mb-6 sm:mb-10 flex items-center gap-3"
          style={{ animationDelay: "200ms" }}
        >
          <span className="size-1.5 rounded-full bg-ink animate-pulse" />
          Producer · Selected catalog
        </div>

        <h1
          className="appear font-display uppercase leading-[0.92] tracking-tight text-[19vw] sm:text-[13.5vw] lg:text-[11.5rem] display-shift origin-left"
          style={{ animationDelay: "300ms" }}
        >
          Tom
          <br />
          Hunter
        </h1>

        <div
          className="appear dot-divider mt-8 sm:mt-12 mb-6"
          style={{ animationDelay: "500ms" }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          <div
            className="appear sm:col-span-2 max-w-xl"
            style={{ animationDelay: "580ms" }}
          >
            <p className="text-sm sm:text-base leading-relaxed">
              Producer crafting records that move between rooms — late-night
              kitchens, headphones on the train, the back of someone&apos;s car.
              Tap any track below to hear a piece of it.
            </p>
          </div>
          <div
            className="appear grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-3 self-end"
            style={{ animationDelay: "660ms" }}
          >
            <Stat
              label="Tracks"
              value={String(trackCount).padStart(2, "0")}
            />
            <Stat
              label="Total streams"
              value={totalStreams > 0 ? formatStreams(totalStreams) : "—"}
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-ink pl-3">
      <div className="text-[10px] uppercase tracking-widest text-ink/50">
        {label}
      </div>
      <div className="font-display text-[2rem] sm:text-[2.5rem] uppercase mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}
