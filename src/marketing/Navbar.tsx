import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  brand?: string;
  /** Right-side slot. Falls back to the default sign in / get started buttons. */
  actions?: ReactNode;
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

const defaultActions = (
  <>
    <Link
      href="/login"
      className={`rounded-nav px-4 py-2 text-sm font-semibold transition-colors hover:bg-hover ${focus}`}
    >
      Sign in
    </Link>
    <Link
      href="/signup"
      className={`rounded-nav bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90 ${focus}`}
    >
      Get started
    </Link>
  </>
);

// Half-circles hanging from the bar's bottom edge (scalloped lining).
const scallop = "radial-gradient(circle at 50% 0, #000 5.5px, transparent 6px)";
const mask = {
  maskImage: scallop,
  WebkitMaskImage: scallop,
  maskSize: "12px 6px",
  WebkitMaskSize: "12px 6px",
  maskRepeat: "repeat-x",
  WebkitMaskRepeat: "repeat-x",
} as const;

export default function Navbar({ brand = "Colbe", actions = defaultActions }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6 md:px-10">
        <Link href="/" className={`flex items-center gap-2.5 rounded-nav ${focus}`}>
          <span className="grid size-8 place-items-center rounded-nav bg-cta text-sm font-bold text-cta-foreground">
            {brand[0]}
          </span>
          <span className="font-[family-name:var(--font-instrument-serif)] text-2xl tracking-tight">
            {brand}
          </span>
        </Link>

        <div className="flex items-center gap-2">{actions}</div>
      </div>

      {/* Scalloped lining: a border-colored layer with a bar-colored layer 1px above it leaves a 1px wavy line. */}
      <div aria-hidden className="absolute inset-x-0 top-full h-1.5 bg-border" style={mask} />
      <div aria-hidden className="absolute inset-x-0 top-[calc(100%-1px)] h-1.5 bg-background" style={mask} />
    </header>
  );
}