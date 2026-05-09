"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type PlayerTrack = {
  id: string;
  title: string;
  artists: string[];
  preview_url: string | null;
  album_art: string | null;
  accent: string | null;
};

type Ctx = {
  current: PlayerTrack | null;
  isPlaying: boolean;
  bass: number;
  treble: number;
  freq: Uint8Array | null;
  play: (t: PlayerTrack) => void;
  toggle: () => void;
  stop: () => void;
};

const PlayerContext = createContext<Ctx | null>(null);

export function usePlayer() {
  const c = useContext(PlayerContext);
  if (!c) throw new Error("usePlayer must be used within PlayerProvider");
  return c;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);
  const [freq, setFreq] = useState<Uint8Array | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);

  const ensureGraph = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.crossOrigin = "anonymous";
      a.preload = "auto";
      a.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current = a;
    }
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audioRef.current!);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  }, []);

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const buf = dataRef.current;
    if (!analyser || !buf) return;
    analyser.getByteFrequencyData(buf);

    let bassSum = 0;
    let bassN = 0;
    let trebleSum = 0;
    let trebleN = 0;
    const len = buf.length;
    const bassEnd = Math.floor(len * 0.08);
    const trebleStart = Math.floor(len * 0.5);
    for (let i = 0; i < bassEnd; i++) {
      bassSum += buf[i];
      bassN++;
    }
    for (let i = trebleStart; i < len; i++) {
      trebleSum += buf[i];
      trebleN++;
    }
    const b = bassN ? bassSum / bassN / 255 : 0;
    const tr = trebleN ? trebleSum / trebleN / 255 : 0;
    setBass(b);
    setTreble(tr);
    setFreq(new Uint8Array(buf));
    document.documentElement.style.setProperty("--bass", b.toFixed(3));
    document.documentElement.style.setProperty("--treble", tr.toFixed(3));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const play = useCallback(
    async (t: PlayerTrack) => {
      ensureGraph();
      if (!t.preview_url) {
        setCurrent(t);
        setIsPlaying(false);
        return;
      }
      const audio = audioRef.current!;
      const ctx = ctxRef.current!;

      if (current?.id !== t.id) {
        audio.src = t.preview_url;
        setCurrent(t);
      }
      try {
        if (ctx.state === "suspended") await ctx.resume();
        await audio.play();
        setIsPlaying(true);
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
      } catch {
        setIsPlaying(false);
      }
    },
    [current?.id, ensureGraph, tick]
  );

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
      } catch {}
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [current, tick]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      ctxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isPlaying && rafRef.current != null) {
      // keep tail decay for a moment then stop loop
      const id = setTimeout(() => {
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        setBass(0);
        setTreble(0);
        document.documentElement.style.setProperty("--bass", "0");
        document.documentElement.style.setProperty("--treble", "0");
      }, 600);
      return () => clearTimeout(id);
    }
  }, [isPlaying]);

  const value = useMemo<Ctx>(
    () => ({ current, isPlaying, bass, treble, freq, play, toggle, stop }),
    [current, isPlaying, bass, treble, freq, play, toggle, stop]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
