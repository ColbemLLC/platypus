"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export type NavbarLink = { label: string; href: string };

type Props = {
  brand?: string;
  links?: NavbarLink[];
  /** Right-side slot. Falls back to the default sign in / get started buttons. */
  actions?: ReactNode;
};

const defaultLinks: NavbarLink[] = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Docs", href: "/docs" },
];

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

export default function Navbar({
  brand = "Platypus",
  links = defaultLinks,
  actions = defaultActions,
}: Props) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const linkClass = (href: string) =>
    `rounded-nav px-3 py-2 text-sm font-medium transition-colors hover:bg-hover ${focus} ${
      path === href ? "bg-hover" : "text-foreground/80"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6 md:px-10">
        <Link href="/" onClick={close} className={`flex items-center gap-2.5 rounded-nav ${focus}`}>
          <span className="grid size-8 place-items-center rounded-nav bg-cta text-sm font-bold text-cta-foreground">
            {brand[0]}
          </span>
          <span className="font-[family-name:var(--font-instrument-serif)] text-2xl tracking-tight">{brand}</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">{actions}</div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className={`ml-auto grid size-10 place-items-center rounded-nav hover:bg-hover md:hidden ${focus}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border px-6 pb-4 pt-2 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col" onClick={close}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`${linkClass(l.href)} py-3`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-divider pt-3" onClick={close}>
            {actions}
          </div>
        </div>
      )}
    </header>
  );
}