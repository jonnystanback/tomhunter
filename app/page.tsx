import { getPlaylistTracks } from "@/lib/spotify";
import { getStreamCount } from "@/lib/streams";
import { TrackCard } from "@/components/TrackCard";
import { ReactiveHero } from "@/components/ReactiveHero";

export const revalidate = 3600;

export default async function Home() {
  const tracks = await getPlaylistTracks();

  const enriched = tracks.map((t) => ({
    ...t,
    streams: getStreamCount(t.id),
  }));

  const totalStreams = enriched.reduce((s, t) => s + t.streams, 0);

  return (
    <>
      <ReactiveHero trackCount={enriched.length} totalStreams={totalStreams} />

      <section className="px-4 sm:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div
            className="appear flex items-baseline justify-between mb-4"
            style={{ animationDelay: "740ms" }}
          >
            <h2 className="font-display text-[1.7rem] sm:text-[2rem] uppercase">
              Selected Works
            </h2>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-ink/50">
              {enriched.length} tracks
            </div>
          </div>
          <div
            className="appear dot-divider mb-2"
            style={{ animationDelay: "800ms" }}
          />

          <div role="list">
            {enriched.length === 0 ? (
              <div className="py-12 text-center text-ink/60">
                Couldn&apos;t reach Spotify right now. Refresh in a moment.
              </div>
            ) : (
              enriched.map((t, i) => (
                <TrackCard key={t.id} track={t} index={i} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
