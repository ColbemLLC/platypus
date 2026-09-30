import Link from "next/link";
import { GradientWave } from "@/packages/ui/GradientWave";

// Hex copies of our dark tokens (WebGL can't read CSS variables):
// background, blue, surface, blue, hover, blue. The first is the base, the rest blend in as waves.
const WAVE_COLORS = ["#121215", "#365ffd", "#19191d", "#365ffd", "#212227", "#365ffd"];
const WAVE_DEFORM = { incline: 0.5, noiseAmp: 250, noiseFlow: 5 };

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <GradientWave colors={WAVE_COLORS} deform={WAVE_DEFORM} />
        <div className="absolute inset-x-0 bottom-0 z-10 h-1/3 bg-linear-to-b from-transparent to-background" />
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