"use client";

import Image from "next/image";
import { usePlayer } from "./PlayerProvider";
import { Visualizer } from "./Visualizer";

export function PlayerBar() {
  const { current, isPlaying, toggle } = usePlayer();

  if (!current) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-ink/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="px-3 sm:px-6 pt-1 pb-2">
        <Visualizer height={36} />
      </div>
      <div className="px-3 sm:px-6 pb-3 flex items-center gap-3">
        <button
          onClick={toggle}
          className="shrink-0 size-11 rounded-full border border-ink flex items-center justify-center hover:bg-ink hover:text-cream transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="3.5" height="12" />
              <rect x="8.5" y="1" width="3.5" height="12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M2 1 L13 7 L2 13 Z" />
            </svg>
          )}
        </button>
        {current.album_art && (
          <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-ink/5">
            <Image
              src={current.album_art}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-display text-[1.18rem] sm:text-[1.35rem] truncate uppercase">
            {current.title}
          </div>
          <div className="text-xs text-ink/60 truncate">
            {current.artists.join(", ")}
          </div>
        </div>
        {!current.preview_url && (
          <div className="text-[10px] uppercase tracking-wider text-ink/50">
            No preview
          </div>
        )}
      </div>
    </div>
  );
}
