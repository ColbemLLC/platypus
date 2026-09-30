import Link from "next/link";

const blob =
  "absolute will-change-transform motion-reduce:animate-none";
const glow = (pct: number) =>
  `radial-gradient(closest-side, color-mix(in oklab, var(--blue) ${pct}%, transparent), transparent)`;

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background: two gradient blobs drifting via CSS transforms only. No JS, no canvas. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`${blob} -left-[15%] -top-[45%] h-[110%] w-[65%] animate-drift-a`}
          style={{ background: glow(40) }}
        />
        <div
          className={`${blob} -right-[10%] top-[5%] h-[90%] w-[55%] animate-drift-b`}
          style={{ background: glow(22) }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-28 text-center md:px-10 md:py-40">
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-6xl leading-[1.05] tracking-[-0.02em] md:text-7xl">
          Your headline goes <em className="text-foreground/50">here</em>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-muted">
          Supporting text that explains the offer in one or two lines.
        </p>
        <Link
          href="/signup"
          className="mt-10 inline-flex h-12 items-center rounded-nav bg-cta px-6 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Primary action
        </Link>
      </div>
    </section>
  );
}