"use client";

import type { ReactNode } from "react";
import { authClient } from "@/packages/db/auth/client";

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export const container = "mx-auto w-full max-w-5xl px-5 md:px-8";

export type IconName = "home" | "guilds" | "communities" | "organization" | "dm" | "badges" | "profile" | "settings" | "plus" | "arrow";

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

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg className={`shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

export type NavItem = { href: string; label: string; icon: IconName };
export type Card = NavItem & { blurb: string };

export const OVERVIEW: NavItem = { href: "/home", label: "Overview", icon: "home" };

export const SECTIONS: Card[] = [
  { href: "/guilds", label: "Guilds", icon: "guilds", blurb: "Chat and organize with your guilds." },
  { href: "/user-communities", label: "Communities", icon: "communities", blurb: "Discover and join communities." },
  { href: "/organization", label: "Organization", icon: "organization", blurb: "Your institution, kept apart from communities." },
  { href: "/dm", label: "Direct messages", icon: "dm", blurb: "Private conversations, one to one." },
  { href: "/badges", label: "Badges", icon: "badges", blurb: "Awarded when you reach a milestone." },
];

export const YOU: Card[] = [
  { href: "/user-profile", label: "Profile", icon: "profile", blurb: "How you appear to everyone else." },
  { href: "/user-settings", label: "Settings", icon: "settings", blurb: "Your account and preferences." },
];

export const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const findNav = (pathname: string): NavItem | undefined =>
  [OVERVIEW, ...SECTIONS, ...YOU].find((item) => isActive(pathname, item.href));

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
        <span className="font-[family-name:var(--font-instrument-serif)] leading-none">{letter}</span>
      )}
    </div>
  );
}

export function Skeleton({ className }: { className: string }) {
  return <div aria-hidden className={`animate-pulse rounded-nav bg-foreground/10 ${className}`} />;
}