import fs from "node:fs";
import path from "node:path";

type StreamRecord = { name: string; artists: string; streams: number };

let cache: Record<string, StreamRecord> | null = null;
let cacheMtime = 0;

function load(): Record<string, StreamRecord> {
  const file = path.join(process.cwd(), "data", "streams.json");
  try {
    const stat = fs.statSync(file);
    if (cache && stat.mtimeMs === cacheMtime) return cache;
    const raw = fs.readFileSync(file, "utf8");
    // Strip thousands-separator commas inside numeric stream values
    // e.g. "streams": 1,234,567  ->  "streams": 1234567
    const cleaned = raw.replace(
      /("streams"\s*:\s*)([0-9][0-9,]*)/g,
      (_m, prefix: string, num: string) => prefix + num.replace(/,/g, "")
    );
    cache = JSON.parse(cleaned);
    cacheMtime = stat.mtimeMs;
    return cache!;
  } catch {
    return cache ?? {};
  }
}

export function getStreamCount(trackId: string): number {
  return load()[trackId]?.streams ?? 0;
}

