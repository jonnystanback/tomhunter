import Image from "next/image";

export const metadata = {
  title: "About — Tom Hunter",
};

export default function About() {
  return (
    <section className="px-4 sm:px-8 pt-10 sm:pt-16 pb-24">
      <div className="max-w-6xl mx-auto">
        <div
          className="appear text-[10px] sm:text-xs uppercase tracking-[0.2em] text-ink/50 mb-6 sm:mb-10"
          style={{ animationDelay: "200ms" }}
        >
          About
        </div>

        <h1
          className="appear font-display uppercase leading-[0.92] tracking-tight text-[19vw] sm:text-[12vw] lg:text-[10rem] display-shift origin-left"
          style={{ animationDelay: "300ms" }}
        >
          The
          <br />
          producer
        </h1>

        <div
          className="appear dot-divider mt-10 mb-10"
          style={{ animationDelay: "500ms" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6 text-sm sm:text-base leading-relaxed">
            <p className="appear" style={{ animationDelay: "580ms" }}>
              Tom Hunter is an LA - based songwriter, producer, and mix engineer.
            </p>

            <div
              className="appear dot-divider my-8"
              style={{ animationDelay: "820ms" }}
            />

            <div
              className="appear grid grid-cols-2 gap-4"
              style={{ animationDelay: "900ms" }}
            >
              <Detail label="Based in" value="Los Angeles" />
              <Detail label="Genres" value="Indie pop · Folk · Indie rock" />
              <Detail
                label="Credits"
                href="https://open.spotify.com/playlist/52Xx7d3uiz2IbHBydfa7gw?si=58bb58f7afe2402d"
                value="See here →"
              />
              <Detail label="For" value="Artists, producers, labels" />
            </div>

            <div
              className="appear pt-6"
              style={{ animationDelay: "980ms" }}
            >
              <a
                href="mailto:thomashunter08@gmail.com"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-ink hover:bg-ink hover:text-cream transition-colors uppercase text-xs tracking-widest"
              >
                Get in touch
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div
            className="appear lg:col-span-5 order-1 lg:order-2"
            style={{ animationDelay: "400ms" }}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
              <Image
                src="/producerimage.jpg"
                alt="Tom Hunter"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-widest text-ink/50">
              In the studio
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ink/50 mb-1">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm underline underline-offset-2 hover:text-ink/60 transition-colors"
        >
          {value}
        </a>
      ) : (
        <div className="font-mono text-sm">{value}</div>
      )}
    </div>
  );
}
