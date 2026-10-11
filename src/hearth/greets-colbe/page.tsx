"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { Icon, SECTIONS, Skeleton, focusRing, useMe } from "../layout/kit";

const ease = [0.25, 1, 0.5, 1] as const;

const primary = `inline-flex h-11 items-center justify-center rounded-nav bg-cta px-6 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90 ${focusRing}`;
const secondary = `inline-flex h-11 items-center justify-center rounded-nav border border-border bg-surface px-6 text-sm font-semibold transition-colors hover:bg-hover ${focusRing}`;

function Greeting() {
  const me = useMe();

  if (!me.ready) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-4 w-56" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="text-center"
    >
      <h1 className="font-(family-name:--font-instrument-serif) text-5xl leading-[1.05] tracking-tight sm:text-6xl">
        Welcome to Colbe, <span className="italic text-foreground/60">{me.name}</span>
      </h1>
      <p className="mt-4 text-lg text-muted">Here is a quick look around before you start.</p>
    </motion.div>
  );
}

function Tour() {
  const [step, setStep] = useState(0);
  const item = SECTIONS[step];
  const last = step === SECTIONS.length - 1;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        role="tablist"
        aria-label="Sections"
        className="mx-auto flex w-fit items-center gap-1 rounded-card border border-border bg-surface p-2"
      >
        {SECTIONS.map((section, i) => (
          <button
            key={section.href}
            type="button"
            role="tab"
            aria-selected={i === step}
            aria-label={section.label}
            title={section.label}
            onClick={() => setStep(i)}
            className={`flex size-11 items-center justify-center rounded-nav border transition-colors ${
              i === step
                ? "border-foreground bg-hover"
                : "border-transparent text-muted hover:bg-hover hover:text-foreground"
            } ${focusRing}`}
          >
            <Icon name={section.icon} active={i === step} className="size-6" />
          </button>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        role="tabpanel"
        className="mt-6 rounded-card border border-border bg-surface p-8 text-center sm:p-12"
      >
        <span className="mx-auto flex size-16 items-center justify-center rounded-card border border-border bg-background">
          <Icon name={item.icon} className="size-8" />
        </span>
        <h2 className="mt-6 font-(family-name:--font-instrument-serif) text-4xl leading-tight tracking-tight">
          {item.label}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-muted">{item.blurb}</p>
        <p className="mt-6 text-sm text-muted">
          {step + 1} of {SECTIONS.length}
        </p>
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className={secondary}>
            Back
          </button>
        )}
        {last ? (
          <Link href="/home" className={primary}>
            Start exploring
          </Link>
        ) : (
          <button type="button" onClick={() => setStep(step + 1)} className={primary}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default function GreetsColbe() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--blue) 38%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 18%, transparent) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black 5%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 5%, transparent 70%)",
          }}
        />

        <header className="flex h-16 items-center justify-between px-5 md:px-10">
          <span className="font-(family-name:--font-instrument-serif) text-2xl leading-none tracking-tight">Colbe</span>
          <Link
            href="/home"
            className={`inline-flex h-9 items-center rounded-nav px-4 text-sm font-medium text-muted transition-colors hover:bg-hover hover:text-foreground ${focusRing}`}
          >
            Skip tour
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-12 px-5 pb-16 pt-6">
          <Greeting />
          <Tour />
        </main>
      </div>
    </MotionConfig>
  );
}