"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Icon, findNav, focusRing, isActive, type NavItem } from "./kit";
import { useTopbarEntry } from "./topbar-content";

const HOME: NavItem = { href: "/home", label: "Home", icon: "home" };

export default function Topbar() {
  const pathname = usePathname();
  const registered = useTopbarEntry();
  const item = isActive(pathname, HOME.href) ? HOME : findNav(pathname);
  const entry = item && item.href !== "/dm" ? registered : null;

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 px-5 md:px-8">
      <Link
        href="/home"
        className={`font-(family-name:--font-instrument-serif) text-2xl leading-none tracking-tight ${focusRing}`}
      >
        Colbe
      </Link>
      {item && (
        <>
          <div aria-hidden className="h-5 w-px rounded-full bg-divider" />
          <div className="flex min-w-0 items-center gap-2">
            {entry ? (
              <Avatar image={entry.image} letter={entry.letter} className="size-6 rounded-nav bg-hover text-sm" />
            ) : (
              <Icon name={item.icon} className="size-5 text-muted" />
            )}
            <h2 className="truncate text-sm font-medium">{entry ? entry.label : item.label}</h2>
          </div>
        </>
      )}
    </header>
  );
}