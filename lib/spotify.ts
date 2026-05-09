import { unstable_cache } from "next/cache";

const PLAYLIST_ID = "52Xx7d3uiz2IbHBydfa7gw";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

export type Track = {
  id: string;
  title: string;
  artists: string[];
  duration_ms: number;
  preview_url: string | null;
  album_art: string | null;
  spotify_url: string;
  release_date: string | null;
  accent: string | null;
};

function extractNextData(html: string): any | null {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

async function fetchEmbed(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return extractNextData(await res.text());
  } catch {
    return null;
  }
}

function rgbToHex(c: { red: number; green: number; blue: number }): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(c.red)}${h(c.green)}${h(c.blue)}`;
}

async function getTrackDetailsOnce(id: string): Promise<{
  album_art: string | null;
  release_date: string | null;
  accent: string | null;
} | null> {
  const data = await fetchEmbed(`https://open.spotify.com/embed/track/${id}`);
  const ent = data?.props?.pageProps?.state?.data?.entity;
  if (!ent) return null;

  const images: { url: string; maxWidth: number }[] =
    ent?.visualIdentity?.image ?? [];
  const best =
    images.find((i) => i.maxWidth >= 600) ??
    images.find((i) => i.maxWidth >= 300) ??
    images[0] ??
    null;

  const bg = ent?.visualIdentity?.backgroundBase;

  return {
    album_art: best?.url ?? null,
    release_date: ent?.releaseDate?.isoString ?? null,
    accent: bg ? rgbToHex(bg) : null,
  };
}

async function getTrackDetails(id: string): Promise<{
  album_art: string | null;
  release_date: string | null;
  accent: string | null;
}> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await getTrackDetailsOnce(id);
    if (result?.album_art) return result;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
  }
  return { album_art: null, release_date: null, accent: null };
}

async function batched<T, R>(
  items: T[],
  size: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    const part = await Promise.all(slice.map(fn));
    out.push(...part);
  }
  return out;
}

export const getPlaylistTracks = unstable_cache(
  async (): Promise<Track[]> => {
    const data = await fetchEmbed(
      `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`
    );
    const trackList = data?.props?.pageProps?.state?.data?.entity?.trackList;
    if (!Array.isArray(trackList)) return [];

    const base = trackList.map((t: any) => {
      const id = String(t.uri).split(":").pop()!;
      return {
        id,
        title: t.title as string,
        artists: String(t.subtitle ?? "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        duration_ms: Number(t.duration ?? 0),
        preview_url: t?.audioPreview?.url ?? null,
        spotify_url: `https://open.spotify.com/track/${id}`,
      };
    });

    const detailed = await batched(base, 5, async (t) => ({
      ...t,
      ...(await getTrackDetails(t.id)),
    }));

    return detailed;
  },
  ["spotify-playlist", PLAYLIST_ID],
  { revalidate: 3600, tags: ["spotify"] }
);
