"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, findNav, focusRing } from "./kit";

export default function Topbar() {
  const item = findNav(usePathname());

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-5 backdrop-blur-md md:px-8">
      <Link
        href="/home"
        className={`font-[family-name:var(--font-instrument-serif)] text-2xl leading-none tracking-[-0.025em] ${focusRing}`}
      >
        Colbe
      </Link>
      {item && (
        <>
          <div aria-hidden className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Icon name={item.icon} className="size-5 text-muted-foreground" />
            <h2 className="text-sm font-medium">{item.label}</h2>
          </div>
        </>
      )}
    </header>
  );
}