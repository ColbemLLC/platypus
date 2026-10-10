"use client";

import Link from "next/link";
import { Icon, focusRing, useDownbarData } from "./kit";

export default function Sidebar() {
  const { groups } = useDownbarData();
  const ownsGroup = groups.some((g) => g.isOwner);

  return (
    <aside className="flex w-[72px] shrink-0 flex-col items-center gap-3 border-r border-border py-4">
      <Link
        href="/home"
        aria-label="Colbe home"
        className={`flex size-12 items-center justify-center rounded-[15px] bg-foreground/10 font-[family-name:var(--font-instrument-serif)] text-3xl leading-none transition-colors hover:bg-foreground/20 ${focusRing}`}
      >
        C
      </Link>

      {ownsGroup && (
        <>
          <div aria-hidden className="h-px w-8 bg-border" />
          <Link
            href="/guilds"
            aria-label="Create a guild"
            className={`flex size-12 items-center justify-center rounded-[15px] border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground ${focusRing}`}
          >
            <Icon name="plus" />
          </Link>
        </>
      )}
    </aside>
  );
}