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

  const visible = enriched.slice(0, 25);
  const hasMore = enriched.length > visible.length;

  return (
    <>
      <ReactiveHero />

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
              {visible.length} of {enriched.length}
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
              visible.map((t, i) => (
                <TrackCard key={t.id} track={t} index={i} />
              ))
            )}
          </div>

          {hasMore && (
            <div
              className="appear flex justify-center mt-10"
              style={{ animationDelay: `${860 + visible.length * 30}ms` }}
            >
              <a
                href="https://open.spotify.com/playlist/52Xx7d3uiz2IbHBydfa7gw?si=58bb58f7afe2402d"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-ink hover:bg-ink hover:text-cream transition-colors uppercase text-xs tracking-widest"
              >
                More on Spotify
                <span aria-hidden>→</span>
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
