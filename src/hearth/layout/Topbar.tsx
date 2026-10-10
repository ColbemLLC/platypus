"use client";

import { usePathname } from "next/navigation";
import { Icon, findNav } from "./kit";

/** Title bar above every dashboard page. The title follows the route, so pages don't render their own. */
export default function Topbar() {
  const item = findNav(usePathname());

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md md:px-8">
      {item && <Icon name={item.icon} className="size-5 text-muted-foreground" />}
      <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl leading-none tracking-[-0.025em]">{item?.label}</h2>
    </header>
  );
}
