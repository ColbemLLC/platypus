"use client";

import type { ReactNode } from "react";
import { authClient } from "@/packages/db/auth/client";

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export const container = "mx-auto w-full max-w-5xl px-5 md:px-8";

export type IconName = "home" | "guilds" | "communities" | "dm" | "badges" | "profile" | "settings" | "inbox" | "plus" | "arrow";

type Draw = (cut: string) => ReactNode;

const COG = "M19.015 10.38 21.877 10.436 21.877 13.564 19.015 13.62A7.2 7.2 0 0 1 18.106 15.815";

const ICONS: Record<IconName, Draw> = {
  home: (cut) => (
    <>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 16.5c.7.9 1.7 1.3 3 1.3s2.3-.4 3-1.3" fill="none" stroke={cut} />
    </>
  ),
  guilds: () => <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
  communities: () => (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" fill="none" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" />
    </>
  ),
  dm: () => <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  badges: () => (
    <>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
  profile: () => (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  settings: (cut) => (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={COG} transform={`rotate(${i * 45} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.8" fill="none" stroke={cut} />
    </>
  ),
  inbox: (cut) => (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7.5 8.5 6 8.5-6" fill="none" stroke={cut} />
    </>
  ),
  plus: () => <path d="M5 12h14M12 5v14" />,
  arrow: () => <path d="M7 7h10v10M7 17 17 7" />,
};

const LINE_ONLY: IconName[] = ["plus", "arrow"];

export function Icon({ name, className = "size-5", active = false }: { name: IconName; className?: string; active?: boolean }) {
  const solid = active && !LINE_ONLY.includes(name);

  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name](solid ? "var(--hover)" : "currentColor")}
    </svg>
  );
}

export type NavItem = { href: string; label: string; icon: IconName };
export type Card = NavItem & { blurb: string };

export const SECTIONS: Card[] = [
  { href: "/guilds", label: "Guilds", icon: "guilds", blurb: "Chat and organize with your guilds." },
  { href: "/user-communities", label: "Communities", icon: "communities", blurb: "Discover and join communities." },
  { href: "/dm", label: "Direct messages", icon: "dm", blurb: "Private conversations, one to one." },
  { href: "/badges", label: "Badges", icon: "badges", blurb: "Awarded when you reach a milestone." },
];

export const YOU: Card[] = [
  { href: "/user-profile", label: "Profile", icon: "profile", blurb: "How you appear to everyone else." },
  { href: "/user-settings", label: "Settings", icon: "settings", blurb: "Your account and preferences." },
];

export const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const findNav = (pathname: string): NavItem | undefined =>
  [...SECTIONS, ...YOU].find((item) => isActive(pathname, item.href));

export function useMe() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const extra = (user ?? {}) as { username?: string | null };
  const name = user?.name ?? "";
  const username = extra.username ?? null;

  return {
    ready: Boolean(user),
    name,
    username,
    image: user?.image ?? null,
    letter: (name || username || "").charAt(0).toUpperCase(),
    joined: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : null,
  };
}

export type Group = { id: string; name: string; image: string | null; href: string; isOwner: boolean };
export type Community = { id: string; name: string; image: string | null; href: string; members: number };

const NONE = { groups: [] as Group[], communities: [] as Community[] };

// No groups/communities tables yet. Replace with real queries.
export function useDownbarData() {
  return NONE;
}

export function Avatar({ image, letter, className = "" }: { image: string | null; letter: string; className?: string }) {
  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden text-foreground ${className}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" />
      ) : (
        <span className="font-(family-name:--font-instrument-serif) leading-none">{letter}</span>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-nav bg-foreground/10 ${className}`} />;
}