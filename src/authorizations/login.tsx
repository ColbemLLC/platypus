"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as motion from "motion/react-client";
import { useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

const ease = [0.25, 1, 0.5, 1] as const;

// Fixed values (no Math.random) so server and client render the same HTML.
const BLOBS = [
  { size: 260, left: 12, top: 18, duration: 22, delay: 0, path: { x: [0, 90, -40, 50], y: [0, 120, 60, -70], scale: [1, 1.2, 0.8, 1.1] } },
  { size: 200, left: 72, top: 12, duration: 26, delay: -6, path: { x: [0, -80, 40, -30], y: [0, 90, 150, 40], scale: [1, 0.85, 1.25, 1] } },
  { size: 320, left: 55, top: 62, duration: 30, delay: -12, path: { x: [0, 70, -90, 20], y: [0, -80, -30, 60], scale: [1, 1.15, 0.9, 1.2] } },
  { size: 170, left: 20, top: 70, duration: 20, delay: -3, path: { x: [0, 60, 100, -20], y: [0, -60, 30, -90], scale: [1, 1.3, 0.9, 1] } },
  { size: 230, left: 85, top: 45, duration: 28, delay: -9, path: { x: [0, -60, -110, -20], y: [0, 70, -50, 30], scale: [1, 0.9, 1.2, 1.05] } },
  { size: 150, left: 40, top: 30, duration: 24, delay: -15, path: { x: [0, 50, -70, 30], y: [0, 100, 40, -60], scale: [1, 1.25, 0.85, 1.1] } },
];

function Blob({ blob, i, mx, my }: { blob: (typeof BLOBS)[number]; i: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  // Subtle parallax: deeper blobs move further, same idea as the margin offset before.
  const speed = (i + 1) * 20;
  const px = useTransform(mx, (v) => v * speed);
  const py = useTransform(my, (v) => v * speed);

  return (
    <motion.div
      className="absolute"
      style={{ width: blob.size, height: blob.size, left: `${blob.left}%`, top: `${blob.top}%`, x: px, y: py }}
    >
      <motion.div
        className="size-full rounded-full bg-primary"
        animate={blob.path}
        transition={{ duration: blob.duration, delay: blob.delay, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      />
    </motion.div>
  );
}

/** Each word slides up out of a clipped box, one after another (same as the hero). */
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
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-nav px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
// Template hover: a fill slides in from the left while the label flips color.
const glass = `${button} relative isolate overflow-hidden border border-foreground/25 bg-foreground/10 text-foreground backdrop-blur-md duration-300 before:absolute before:inset-y-0 before:left-0 before:-z-10 before:w-0 before:bg-foreground before:transition-[width] before:duration-300 before:content-[''] hover:text-background hover:before:w-full`;

type Provider = "google" | "github";

export default function Login({
  onOAuth,
  onEmail,
}: {
  onOAuth?: (provider: Provider) => void;
  onEmail?: (email: string) => void;
}) {
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-6 py-16">
      {/* Goo filter: merges overlapping blobs into liquid shapes */}
      <svg aria-hidden className="absolute size-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-60 [filter:url(#gooey)]">
        {BLOBS.map((b, i) => (
          <Blob key={i} blob={b} i={i} mx={mx} my={my} />
        ))}
      </div>

      <div className="w-full max-w-md rounded-[15px] border border-border bg-background/70 p-8 backdrop-blur-xl md:p-10">
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-5xl leading-[1.02] tracking-[-0.025em] md:text-6xl">
          <span className="block"><Words text="Welcome" delay={0.1} /></span>
          <span className="block"><Words text="back." className="italic text-foreground/60" delay={0.25} /></span>
        </h1>

        <motion.p className="mt-4 text-base leading-relaxed text-foreground/70" {...fade(0.4)}>
          Sign in to Colbe and find your guild.
        </motion.p>

        <motion.div className="mt-8 flex flex-col gap-3" {...fade(0.5)}>
          <button type="button" className={glass} onClick={() => onOAuth?.("google")}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
          <button type="button" className={glass} onClick={() => onOAuth?.("github")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Continue with GitHub
          </button>
        </motion.div>

        <motion.div className="my-6 flex items-center gap-3 text-xs font-semibold tracking-widest text-foreground/50" {...fade(0.6)}>
          <div className="h-px flex-1 bg-foreground/15" />
          OR
          <div className="h-px flex-1 bg-foreground/15" />
        </motion.div>

        <motion.form
          className="flex flex-col gap-3"
          {...fade(0.7)}
          onSubmit={(e) => {
            e.preventDefault();
            const email = new FormData(e.currentTarget).get("email");
            if (typeof email === "string") onEmail?.(email);
          }}
        >
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email"
            className="h-12 w-full rounded-nav border border-foreground/25 bg-foreground/5 px-5 text-sm text-foreground backdrop-blur-md outline-none transition-colors placeholder:text-foreground/50 focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          />
          <button type="submit" className={`${button} bg-cta text-cta-foreground hover:opacity-90`}>
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 17 5-5-5-5" />
              <path d="m13 17 5-5-5-5" />
            </svg>
          </button>
        </motion.form>

        <motion.p className="mt-6 text-center text-sm text-foreground/60" {...fade(0.8)}>
          New to Colbe?{" "}
          <Link href="/register" className="font-semibold text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </motion.p>
      </div>
    </section>
  );
}