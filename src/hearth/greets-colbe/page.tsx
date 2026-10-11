"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { Icon, SECTIONS, Skeleton, focusRing, useMe } from "../layout/kit";

const primary = `inline-flex h-10 items-center justify-center rounded-nav bg-cta px-5 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90 ${focusRing}`;
const secondary = `inline-flex h-10 items-center justify-center rounded-nav border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-hover ${focusRing}`;

function Tour() {
  const me = useMe();
  const [step, setStep] = useState(0);
  const item = SECTIONS[step];
  const last = step === SECTIONS.length - 1;

  return (
    <div className="w-full max-w-md">
      {me.ready ? (
        <h1 className="font-(family-name:--font-instrument-serif) text-3xl leading-tight tracking-tight">
          Welcome, {me.name}
        </h1>
      ) : (
        <Skeleton className="h-8 w-48" />
      )}
      <p className="mt-1 text-sm text-muted">A quick look at what you can do here.</p>

      <div role="tablist" aria-label="Sections" className="mt-5 flex items-center gap-1">
        {SECTIONS.map((section, i) => (
          <button
            key={section.href}
            type="button"
            role="tab"
            aria-selected={i === step}
            aria-label={section.label}
            title={section.label}
            onClick={() => setStep(i)}
            className={`flex size-10 items-center justify-center rounded-nav border transition-colors ${
              i === step ? "border-foreground bg-hover" : "border-transparent text-muted hover:bg-hover hover:text-foreground"
            } ${focusRing}`}
          >
            <Icon name={section.icon} active={i === step} className="size-5" />
          </button>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        role="tabpanel"
        className="mt-3 rounded-card border border-border bg-background p-5"
      >
        <h2 className="font-(family-name:--font-instrument-serif) text-2xl leading-tight tracking-tight">{item.label}</h2>
        <p className="mt-1 text-muted">{item.blurb}</p>
      </motion.div>

      <div className="mt-4 flex items-center gap-2">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className={secondary}>
            Back
          </button>
        )}
        {last ? (
          <Link href="/home" className={primary}>
            Done
          </Link>
        ) : (
          <button type="button" onClick={() => setStep(step + 1)} className={primary}>
            Next
          </button>
        )}
        {!last && (
          <Link href="/home" className={`ml-auto text-sm text-muted transition-colors hover:text-foreground ${focusRing}`}>
            Skip
          </Link>
        )}
      </div>
    </div>
  );
}

export default function GreetsColbe() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex justify-center px-5 py-10 md:px-10">
        <Tour />
      </div>
    </MotionConfig>
  );
}