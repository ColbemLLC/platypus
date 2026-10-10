"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Avatar, Icon, OVERVIEW, SECTIONS, YOU, focusRing, isActive, useDownbarData, useMe } from "./kit";

const BASE = 44;
const MIN = 36; // smallest community tile
const MAX = 52; // biggest community tile

function Tile({
  label,
  active = false,
  size = BASE,
  className = "",
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  size?: number;
  className?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-[15px] transition-colors ${focusRing} ${
        active
          ? "bg-foreground/15 text-foreground ring-1 ring-foreground/30"
          : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
      } ${className}`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div aria-hidden className="h-8 w-px shrink-0 bg-border" />;

/**
 * Bottom bar, icons centered: section presets | groups | communities (big to small) | plus (admins only).
 * router.push keeps route URLs out of the browser status bar.
 */
export default function Downbar() {
  const router = useRouter();
  const pathname = usePathname();
  const me = useMe();
  const { groups, communities } = useDownbarData();

  // Biggest community first; tile size follows its share of the biggest member count.
  const sorted = [...communities].sort((a, b) => b.members - a.members);
  const top = sorted[0]?.members || 1;
  const sizeOf = (members: number) => Math.round(MIN + (members / top) * (MAX - MIN));

  // Site admin, or admin of at least one group.
  const canCreate = me.isAdmin || groups.some((g) => g.isAdmin);

  return (
    <footer className="grid h-[72px] shrink-0 grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 border-t border-border bg-background/80 px-3 backdrop-blur-md">
      <div />

      <nav aria-label="Primary" className="min-w-0 overflow-x-auto [scrollbar-width:none]">
        <div className="mx-auto flex h-[72px] w-max items-center gap-2 px-1">
          {[OVERVIEW, ...SECTIONS].map((item) => (
            <Tile key={item.href} label={item.label} active={isActive(pathname, item.href)} onClick={() => router.push(item.href)}>
              <Icon name={item.icon} />
            </Tile>
          ))}

          {groups.length > 0 && <Divider />}
          {groups.map((g) => (
            <Tile key={g.id} label={g.name} active={isActive(pathname, g.href)} onClick={() => router.push(g.href)}>
              <Avatar image={g.image} letter={g.name.charAt(0).toUpperCase()} className="size-full rounded-[15px] bg-foreground/10 text-xl" />
            </Tile>
          ))}

          {sorted.length > 0 && <Divider />}
          {sorted.map((c) => (
            <Tile key={c.id} label={`${c.name} · ${c.members} members`} size={sizeOf(c.members)} active={isActive(pathname, c.href)} onClick={() => router.push(c.href)}>
              <Avatar image={c.image} letter={c.name.charAt(0).toUpperCase()} className="size-full rounded-[15px] bg-foreground/10 text-xl" />
            </Tile>
          ))}

          {canCreate && (
            <>
              <Divider />
              <Tile label="Create a guild" className="border border-dashed border-border hover:border-foreground/50" onClick={() => router.push("/guilds")}>
                <Icon name="plus" />
              </Tile>
            </>
          )}
        </div>
      </nav>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => router.push(YOU[0].href)}
          aria-label="Open your profile"
          className={`flex h-11 items-center gap-3 rounded-nav px-2 text-left transition-colors hover:bg-foreground/5 ${focusRing}`}
        >
          <Avatar image={me.image} letter={me.letter} className="size-9 rounded-full bg-foreground/10 text-lg" />
          <span className="hidden min-w-0 flex-col md:flex">
            <span className="max-w-32 truncate text-sm font-semibold leading-tight">{me.name || " "}</span>
            {me.username && <span className="max-w-32 truncate text-xs leading-tight text-muted-foreground">@{me.username}</span>}
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.push(YOU[1].href)}
          aria-label="Settings"
          className={`hidden size-10 items-center justify-center rounded-nav text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground sm:flex ${focusRing}`}
        >
          <Icon name="settings" />
        </button>
      </div>
    </footer>
  );
}
