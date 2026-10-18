"use client";

import type { ReactNode } from "react";
import { authClient } from "@/packages/db/auth/client";

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export const container = "mx-auto w-full max-w-5xl px-5 md:px-8";

export type IconName = "home" | "guilds" | "communities" | "dm" | "badges" | "profile" | "settings" | "inbox" | "plus" | "arrow";

type Draw = (cut: string, solid: boolean) => ReactNode;

// Nucleo micro-bold icons (20x20 grid). Everything else stays on the 24x24 grid.
const NUCLEO: IconName[] = ["home", "communities", "dm", "badges", "settings", "inbox"];

const F = { fill: "currentColor", stroke: "none", strokeWidth: 0 } as const;

const ICONS: Record<IconName, Draw> = {
  home: () => (
    <>
      <path {...F} d="m10,6.105l-7,4.648v3.246c0,2.206,1.794,4,4,4h2v-3c0-.552.447-1,1-1s1,.448,1,1v3h2c2.206,0,4-1.794,4-4v-3.217l-7-4.678Z" />
      <path {...F} d="m17.499,8.5c-.19,0-.383-.054-.554-.168l-6.945-4.63-6.945,4.63c-.462.307-1.082.182-1.387-.277-.307-.459-.183-1.081.277-1.387L9.445,1.668c.336-.224.773-.224,1.109,0l7.5,5c.46.306.584.927.277,1.387-.192.289-.51.445-.833.445Z" />
    </>
  ),
  guilds: () => <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
  communities: () => (
    <>
      <circle cx="6.5" cy="8" r="2" fill="currentColor" />
      <circle cx="13.5" cy="5" r="2" fill="currentColor" />
      <path {...F} d="m18.16,12.226c-.744-1.96-2.573-3.226-4.66-3.226-1.509,0-2.876.669-3.803,1.776,1.498.77,2.699,2.071,3.332,3.74.058.153.092.309.127.465.115.005.229.02.344.02,1.297,0,2.594-.299,3.881-.898.711-.331,1.053-1.155.778-1.876Z" />
      <path {...F} d="m11.16,15.226c-.744-1.96-2.573-3.226-4.66-3.226s-3.916,1.266-4.66,3.226c-.275.722.067,1.546.778,1.877,1.288.599,2.584.898,3.881.898s2.594-.299,3.881-.898c.711-.331,1.053-1.155.778-1.876Z" />
    </>
  ),
  dm: () => (
    <path {...F} d="m10,2C5.589,2,2,5.589,2,10c0,1.44.388,2.789,1.057,3.958l-1.018,3.055c-.09.27-.02.567.181.768.143.143.334.22.53.22.08,0,.16-.013.237-.039l3.055-1.018c1.169.669,2.518,1.057,3.958,1.057,4.411,0,8-3.589,8-8S14.411,2,10,2Zm-3.25,9.5c-.69,0-1.25-.56-1.25-1.25s.56-1.25,1.25-1.25,1.25.56,1.25,1.25-.56,1.25-1.25,1.25Zm3.25,3.5c-1.104,0-2-.896-2-2,0-.368.299-.667.667-.667h2.667c.368,0,.667.299.667.667,0,1.104-.896,2-2,2Zm3.25-3.5c-.69,0-1.25-.56-1.25-1.25s.56-1.25,1.25-1.25,1.25.56,1.25,1.25-.56,1.25-1.25,1.25Z" />
  ),
  badges: (_cut, solid) => (
    <path
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      d="m10.763,3.038l1.779,3.604,3.979.578c.698.101.977.959.472,1.452l-2.879,2.806.68,3.962c.119.695-.61,1.225-1.235.897l-3.558-1.87-3.558,1.87c-.624.328-1.354-.202-1.235-.897l.68-3.962-2.879-2.806c-.505-.492-.226-1.35.472-1.452l3.979-.578,1.779-3.604c.312-.633,1.214-.633,1.526,0Z"
    />
  ),
  profile: () => (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  settings: () => (
    <path {...F} d="m17.447,8.605l-.673-.336c-.167-.653-.425-1.268-.761-1.834l.238-.715c.12-.359.026-.756-.242-1.023l-.707-.707c-.268-.269-.665-.363-1.023-.242l-.715.238c-.565-.336-1.181-.594-1.834-.761l-.336-.673c-.169-.339-.516-.553-.895-.553h-1c-.379,0-.725.214-.895.553l-.336.673c-.653.167-1.268.425-1.834.761l-.715-.238c-.359-.121-.755-.026-1.023.242l-.707.707c-.268.268-.361.664-.242,1.023l.238.715c-.336.565-.594,1.181-.761,1.834l-.673.336c-.339.169-.553.516-.553.895v1c0,.379.214.725.553.895l.673.336c.167.653.425,1.268.761,1.834l-.238.715c-.12.359-.026.756.242,1.023l.707.707c.19.191.446.293.707.293.106,0,.212-.017.316-.051l.715-.238c.565.336,1.181.594,1.834.761l.336.673c.169.339.516.553.895.553h1c.379,0,.725-.214.895-.553l.336-.673c.653-.167,1.268-.425,1.834-.761l.715.238c.104.035.21.051.316.051.261,0,.517-.103.707-.293l.707-.707c.268-.268.361-.664.242-1.023l-.238-.715c.336-.565.594-1.181.761-1.834l.673-.336c.339-.169.553-.516.553-.895v-1c0-.379-.214-.725-.553-.895Zm-7.447,6.395c-2.761,0-5-2.239-5-5s2.239-5,5-5,5,2.239,5,5-2.239,5-5,5Z" />
  ),
  inbox: (cut, solid) => (
    <>
      <rect x="3" y="4" width="14" height="12" rx="3" ry="3" fill={solid ? "currentColor" : "none"} />
      <path d="m3,7l6.504,3.716c.307.176.685.176.992,0l6.504-3.716" fill="none" stroke={cut} />
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
      viewBox={NUCLEO.includes(name) ? "0 0 20 20" : "0 0 24 24"}
      fill={solid ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name](solid ? "var(--hover)" : "currentColor", solid)}
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