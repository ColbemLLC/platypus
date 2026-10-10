"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/packages/db/auth/client";
import { GradientWave } from "@/packages/ui/GradientWave";

const ease = [0.25, 1, 0.5, 1] as const;

// Hex copies of globals.css tokens (WebGL can't read CSS variables).
const WAVE_COLORS = ["#365ffd", "#0a0a0f", "#365ffd", "#0a0a0f"];
const WAVE_DEFORM = { incline: 0.5, noiseAmp: 250, noiseFlow: 5 };

/* ------------------------------------------------------------------ */
/* Icons (inline, no extra dependency)                                 */
/* ------------------------------------------------------------------ */

type IconName = "home" | "guilds" | "communities" | "organization" | "dm" | "badges" | "profile" | "settings" | "plus" | "arrow";

const ICONS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  guilds: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
  communities: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  organization: (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </>
  ),
  dm: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  badges: (
    <>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
  profile: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  settings: <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
  plus: <path d="M5 12h14M12 5v14" />,
  arrow: <path d="M7 7h10v10M7 17 17 7" />,
};

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation (real routes only)                                       */
/* ------------------------------------------------------------------ */

type NavItem = { href: string; label: string; icon: IconName };
type Card = NavItem & { blurb: string };

const OVERVIEW: NavItem = { href: "/home", label: "Overview", icon: "home" };

const SECTIONS: Card[] = [
  { href: "/guilds", label: "Guilds", icon: "guilds", blurb: "Chat and organize with your guilds." },
  { href: "/user-communities", label: "Communities", icon: "communities", blurb: "Discover and join communities." },
  { href: "/organization", label: "Organization", icon: "organization", blurb: "Your institution, kept apart from communities." },
  { href: "/dm", label: "Direct messages", icon: "dm", blurb: "Private conversations, one to one." },
  { href: "/badges", label: "Badges", icon: "badges", blurb: "Awarded when you reach a milestone." },
];

const YOU: Card[] = [
  { href: "/user-profile", label: "Profile", icon: "profile", blurb: "How you appear to everyone else." },
  { href: "/user-settings", label: "Settings", icon: "settings", blurb: "Your account and preferences." },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/* ------------------------------------------------------------------ */
/* Motion helpers (same pattern as the hero)                           */
/* ------------------------------------------------------------------ */

/** Each word slides up out of a clipped box, one after another. */
function Words({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.15em] pr-[0.1em] -mb-[0.15em] -mr-[0.1em] align-bottom">
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

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Avatar({ image, letter, className = "" }: { image: string | null; letter: string; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden bg-muted text-foreground ${className}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" />
      ) : (
        <span className="font-[family-name:var(--font-instrument-serif)] leading-none">{letter}</span>
      )}
    </div>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-nav bg-foreground/10 ${className}`} />;
}

/** Far left rail. Guild icons will stack here once guilds exist. */
function Rail() {
  return (
    <aside className="hidden w-[72px] shrink-0 flex-col items-center gap-3 border-r border-border bg-background py-4 lg:flex">
      <Link
        href="/home"
        aria-label="Colbe home"
        className={`flex size-12 items-center justify-center rounded-[15px] bg-primary font-[family-name:var(--font-instrument-serif)] text-3xl leading-none text-primary-foreground transition-opacity hover:opacity-90 ${focusRing}`}
      >
        C
      </Link>
      <div aria-hidden className="h-px w-8 bg-border" />
      <Link
        href="/guilds"
        aria-label="Guilds"
        className={`flex size-12 items-center justify-center rounded-[15px] border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground ${focusRing}`}
      >
        <Icon name="plus" />
      </Link>
    </aside>
  );
}

function PanelLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 items-center gap-3 rounded-nav px-3 text-sm font-medium transition-colors ${focusRing} ${
        active ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
      }`}
    >
      <Icon name={item.icon} className="size-[18px]" />
      {item.label}
    </Link>
  );
}

function Panel() {
  const pathname = usePathname();
  const group = (title: string, items: NavItem[]) => (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {items.map((item) => (
        <PanelLink key={item.href} item={item} pathname={pathname} />
      ))}
    </div>
  );

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-muted/30 p-4 lg:flex">
      <div className="px-3 pt-2">
        <p className="font-[family-name:var(--font-instrument-serif)] text-3xl leading-none tracking-[-0.025em]">Colbe</p>
        <p className="mt-1.5 text-sm text-muted-foreground">Home</p>
      </div>
      <nav aria-label="Sections" className="flex flex-col gap-6">
        {group("Sections", [OVERVIEW, ...SECTIONS])}
        {group("You", YOU)}
      </nav>
    </aside>
  );
}

function SectionCard({ item, index }: { item: Card; index: number }) {
  return (
    <motion.div {...fade(0.55 + index * 0.06)}>
      <Link
        href={item.href}
        className={`group relative flex h-full flex-col gap-5 overflow-hidden rounded-[15px] border border-border bg-foreground/5 p-5 backdrop-blur-md transition-colors hover:border-primary/60 hover:bg-foreground/10 ${focusRing}`}
      >
        <div className="flex items-start justify-between">
          <span className="flex size-10 items-center justify-center rounded-nav border border-border bg-background/60 text-primary">
            <Icon name={item.icon} />
          </span>
          <Icon
            name="arrow"
            className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>
        <div>
          <h3 className="font-[family-name:var(--font-instrument-serif)] text-2xl leading-tight tracking-[-0.025em]">{item.label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{item.blurb}</p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        />
      </Link>
    </motion.div>
  );
}

function About({ name, username, joined }: { name: string; username: string | null; joined: string | null }) {
  const row = (label: string, value: string | null) => (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm">{value}</dd>
    </div>
  );

  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-muted/30 p-4 xl:flex">
      <div className="rounded-[15px] border border-border bg-background/60 p-5">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl tracking-[-0.025em]">About you</h2>
        {name ? (
          <dl className="mt-5 flex flex-col gap-4">
            {row("Name", name)}
            {username && row("Username", `@${username}`)}
            {joined && row("Joined", joined)}
          </dl>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/user-profile"
            className={`inline-flex h-10 items-center justify-center rounded-nav bg-cta px-4 text-sm font-semibold text-cta-foreground transition-colors hover:opacity-90 ${focusRing}`}
          >
            Edit profile
          </Link>
          <Link
            href="/user-settings"
            className={`inline-flex h-10 items-center justify-center rounded-nav border border-foreground/25 bg-foreground/10 px-4 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-foreground/20 ${focusRing}`}
          >
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** Bottom bar. router.push keeps route URLs out of the browser status bar. */
function BottomBar({ name, username, image, letter }: { name: string; username: string | null; image: string | null; letter: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <footer className="flex h-16 shrink-0 items-center gap-3 border-t border-border bg-muted/40 px-3 backdrop-blur-md">
      <nav aria-label="Primary" className="flex items-center gap-1 lg:hidden">
        {[OVERVIEW, ...SECTIONS].map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex size-10 items-center justify-center rounded-nav transition-colors ${focusRing} ${
                active ? "bg-foreground/10 text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Icon name={item.icon} />
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => router.push("/user-profile")}
          aria-label="Open your profile"
          className={`flex h-11 items-center gap-3 rounded-nav px-2 text-left transition-colors hover:bg-foreground/5 ${focusRing}`}
        >
          <Avatar image={image} letter={letter} className="size-9 rounded-full text-lg" />
          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="max-w-40 truncate text-sm font-semibold leading-tight">{name || "\u00A0"}</span>
            {username && <span className="max-w-40 truncate text-xs leading-tight text-muted-foreground">@{username}</span>}
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/user-settings")}
          aria-label="Settings"
          className={`hidden size-10 items-center justify-center rounded-nav text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground sm:flex ${focusRing}`}
        >
          <Icon name="settings" />
        </button>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { data } = authClient.useSession();
  const user = data?.user;

  const name = user?.name ?? "";
  const username = (user as { username?: string | null } | undefined)?.username ?? null;
  const image = user?.image ?? null;
  const letter = (name || username || "").charAt(0).toUpperCase();
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-svh flex-col bg-background text-foreground">
        <div className="flex min-h-0 flex-1">
          <Rail />
          <Panel />

          <main className="min-w-0 flex-1 overflow-y-auto">
            <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md md:px-8">
              <Icon name="home" className="size-5 text-muted-foreground" />
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl leading-none tracking-[-0.025em]">Overview</h2>
            </header>

            {/* Banner: static gradient underneath, the wave sits on top unless motion is reduced */}
            <div className="relative h-44 overflow-hidden bg-linear-to-br from-primary/60 via-primary/25 to-muted sm:h-56">
              <div aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
                <GradientWave colors={WAVE_COLORS} deform={WAVE_DEFORM} />
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-b from-transparent to-background" />
            </div>

            <div className="mx-auto w-full max-w-5xl px-5 pb-16 md:px-8">
              {/* Identity, overlapping the banner */}
              <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
                >
                  <Avatar image={image} letter={letter} className="size-28 rounded-[15px] border-4 border-background text-5xl sm:size-32" />
                </motion.div>

                <div className="min-w-0 pb-1">
                  {user ? (
                    <>
                      <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
                        <span className="block"><Words text="Welcome back," delay={0.2} /></span>
                        <span className="block break-words"><Words text={name} className="italic text-foreground/60" delay={0.35} /></span>
                      </h1>
                      {username && (
                        <motion.p className="mt-2 text-sm text-muted-foreground" {...fade(0.5)}>
                          @{username}
                        </motion.p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-9 w-56" />
                      <Skeleton className="h-9 w-40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Sections */}
              <section aria-labelledby="jump-in" className="mt-12">
                <motion.h2
                  id="jump-in"
                  className="font-[family-name:var(--font-instrument-serif)] text-3xl tracking-[-0.025em]"
                  {...fade(0.5)}
                >
                  Jump <span className="italic text-foreground/60">in.</span>
                </motion.h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[...SECTIONS, YOU[0]].map((item, i) => (
                    <SectionCard key={item.href} item={item} index={i} />
                  ))}
                </div>
              </section>
            </div>
          </main>

          <About name={name} username={username} joined={joined} />
        </div>

        <BottomBar name={name} username={username} image={image} letter={letter} />
      </div>
    </MotionConfig>
  );
}