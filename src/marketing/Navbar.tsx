"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Heart, Info } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { NotchNav, type NotchItemData } from "./notch-nav";

type NavItem = NotchItemData & { href: string };

// Add new pages here as the site grows.
const items: NavItem[] = [
  { id: "about", label: "About", href: "/about", icon: Info },
  { id: "docs", label: "Documentation", href: "/docs", icon: BookOpen },
  { id: "credits", label: "Credits", href: "/credits", icon: Heart },
];

type Props = {
  brand?: string;
  /** Right-side slot. Falls back to the default sign in / get started buttons. */
  actions?: ReactNode;
  children?: ReactNode;
};

const defaultActions = (
  <div className="flex items-center gap-1">
    <Link
      href="/login"
      className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-background/10 max-sm:hidden"
    >
      Sign in
    </Link>
    <Link
      href="/register"
      className="rounded-full bg-cta px-3.5 py-1.5 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90"
    >
      Get started
    </Link>
  </div>
);

export default function Navbar({
  brand = "Colbe",
  actions = defaultActions,
  children,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const active = items.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  const handleActiveChange = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (target) router.push(target.href);
  };

  return (
    <NotchNav
      items={items}
      activeId={active?.id ?? ""}
      onActiveChange={handleActiveChange}
      logo={
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github.com/ColbemLLC.png"
            alt={`${brand} logo`}
            width={24}
            height={24}
            className="size-6 rounded-md"
          />
          <span className="font-[family-name:var(--font-instrument-serif)] text-xl tracking-tight">
            {brand}
          </span>
        </Link>
      }
      rightContent={actions}
    >
      {children}
    </NotchNav>
  );
}