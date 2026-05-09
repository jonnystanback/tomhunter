"use client";

import Image from "next/image";
import { usePlayer, type PlayerTrack } from "./PlayerProvider";
import { formatDuration, formatYear, formatStreams } from "@/lib/format";

type Props = {
  track: PlayerTrack & {
    duration_ms: number;
    spotify_url: string;
    release_date: string | null;
    streams: number;
  };
  index: number;
};

export function TrackCard({ track, index }: Props) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const isCurrent = current?.id === track.id;
  const playing = isCurrent && isPlaying;

  const handle = () => {
    if (isCurrent) toggle();
    else play(track);
  };

  return (
    <div
      className="appear group grid grid-cols-[28px_56px_1fr_auto] sm:grid-cols-[40px_64px_1fr_auto_auto] items-center gap-3 sm:gap-5 py-3 sm:py-4 border-b border-ink/10 hover:bg-ink/[0.03] transition-colors cursor-pointer"
      style={{ animationDelay: `${860 + index * 30}ms` }}
      onClick={handle}
    >
      <div className="font-mono text-[11px] sm:text-xs text-ink/50 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative size-12 sm:size-16 overflow-hidden rounded-md bg-ink/5">
        {track.album_art ? (
          <Image
            src={track.album_art}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-ink/40 transition-opacity ${
            playing
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="rgb(var(--cream))">
              <rect x="2" y="1" width="3.5" height="12" />
              <rect x="8.5" y="1" width="3.5" height="12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="rgb(var(--cream))">
              <path d="M2 1 L13 7 L2 13 Z" />
            </svg>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <div className="font-display text-[1.18rem] sm:text-[1.35rem] uppercase truncate leading-tight tracking-normal">
          {track.title}
        </div>
        <div className="text-[11px] sm:text-xs text-ink/60 truncate mt-0.5">
          {track.artists.join(", ")}
          {track.release_date ? (
            <span className="text-ink/40"> · {formatYear(track.release_date)}</span>
          ) : null}
        </div>
      </div>

      <div className="hidden sm:block font-mono text-xs text-ink/70 tabular-nums whitespace-nowrap">
        {formatStreams(track.streams)} <span className="text-ink/40">streams</span>
      </div>

      <div className="font-mono text-[11px] sm:text-xs text-ink/50 tabular-nums whitespace-nowrap">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
}
