import Link from "next/link";
import * as motion from "motion/react-client";
import { GradientWave } from "@/packages/ui/GradientWave";

// Hex copies of globals.css tokens (WebGL can't read CSS variables):
// --blue is the base, --background white blends in as waves.
const WAVE_COLORS = ["#365ffd", "#ffffff", "#365ffd", "#ffffff"];
const WAVE_DEFORM = { incline: 0.5, noiseAmp: 250, noiseFlow: 5 };

const ease = [0.25, 1, 0.5, 1] as const;

/** Each word slides up out of a clipped box, one after another. */
function Words({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em] pr-[0.1em] -mb-[0.15em] -mr-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, ease, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

const button =
  "inline-flex h-12 items-center gap-2 rounded-nav px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <GradientWave colors={WAVE_COLORS} deform={WAVE_DEFORM} />
        <div className="absolute inset-x-0 bottom-0 z-10 h-3/4 bg-linear-to-b from-transparent via-background/70 to-background" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 text-left md:px-10 md:pb-24">
        <h1 className="max-w-4xl font-[family-name:var(--font-instrument-serif)] text-6xl leading-[1.02] tracking-[-0.025em] [text-shadow:0_2px_32px_rgb(0_0_0/0.5)] md:text-8xl">
          <span className="block"><Words text="Where every guild" delay={0.1} /></span>
          <span className="block"><Words text="finds its home." className="italic text-foreground/60" delay={0.3} /></span>
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/90 [text-shadow:0_1px_20px_rgb(0_0_0/0.5)]"
          {...fade(0.55)}
        >
          Colbe brings guild chat, direct messages and a developer hub together in one place, on the web and natively on Windows.
        </motion.p>

        <motion.div className="mt-9 flex flex-wrap items-center gap-3" {...fade(0.7)}>
          <Link href="/download" className={`${button} bg-cta text-cta-foreground hover:opacity-90`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
            </svg>
            Download
          </Link>
          <Link href="/docs" className={`${button} border border-foreground/25 bg-foreground/10 text-foreground backdrop-blur-md hover:bg-foreground/20`}>
            Docs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}