"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, OVERVIEW, SECTIONS, YOU, focusRing, isActive, type NavItem } from "./kit";

function Entry({ item, pathname }: { item: NavItem; pathname: string }) {
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

function Group({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {items.map((item) => (
        <Entry key={item.href} item={item} pathname={pathname} />
      ))}
    </div>
  );
}

/** Left panel, large screens only. Below lg the downbar carries the navigation. */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-foreground/[0.03] p-4 lg:flex">
      <div className="px-3 pt-2">
        <p className="font-[family-name:var(--font-instrument-serif)] text-3xl leading-none tracking-[-0.025em]">Colbe</p>
      </div>
      <nav aria-label="Sections" className="flex flex-col gap-6">
        <Group title="Sections" items={[OVERVIEW, ...SECTIONS]} pathname={pathname} />
        <Group title="You" items={YOU} pathname={pathname} />
      </nav>
    </aside>
  );
}
