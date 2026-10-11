"use client";

import { usePathname, useRouter } from "next/navigation";
import { House, SlidersHorizontal }  from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Avatar, Icon, SECTIONS, Skeleton, focusRing, useMe } from "./kit";

function NavButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`flex size-11 shrink-0 items-center justify-center rounded-nav border transition-colors ${
        active ? "border-foreground bg-hover" : "border-transparent text-muted hover:bg-hover hover:text-foreground"
      } ${focusRing}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-2 h-7 w-px shrink-0 bg-divider" />;
}

function UserChip() {
  const me = useMe();
  const router = useRouter();

  if (!me.ready) return <Skeleton className="h-10 w-36" />;

  return (
    <button
      type="button"
      onClick={() => router.push("/user-profile")}
      aria-label="Your profile"
      className={`flex items-center gap-3 rounded-nav px-2 py-1 text-left transition-colors hover:bg-hover ${focusRing}`}
    >
      <Avatar image={me.image} letter={me.letter} className="size-9 rounded-nav bg-background" />
      <span className="hidden min-w-0 sm:block">
        <span className="block truncate text-sm font-medium leading-tight">{me.name}</span>
        {me.username && <span className="block truncate text-xs leading-tight text-muted">@{me.username}</span>}
      </span>
    </button>
  );
}

export default function Downbar() {
  return (
    <footer className="flex h-16 shrink-0 items-center border-t border-border bg-surface px-3">
      <nav aria-label="Sections" className="flex min-w-0 items-center gap-1 overflow-x-auto">
        <NavButton href="/home" label="Home">
          <House className="size-6" />
        </NavButton>
        <Divider />
        {SECTIONS.map((item) => (
          <NavButton key={item.href} href={item.href} label={item.label}>
            <Icon name={item.icon} />
          </NavButton>
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1 pl-3">
        <UserChip />
        <Divider />
        <NavButton href="/user-settings" label="Settings">
          <SlidersHorizontal className="size-6" />
        </NavButton>
      </div>
    </footer>
  );
}