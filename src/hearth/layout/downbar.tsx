"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, Icon, SECTIONS, Skeleton, focusRing, isActive, useMe, type IconName } from "./kit";

const button = "flex size-11 shrink-0 items-center justify-center rounded-nav border transition-colors";
const idle = "border-transparent text-muted hover:bg-hover hover:text-foreground";

function NavButton({ href, label, icon }: { href: string; label: string; icon: IconName }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = isActive(pathname, href);

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      className={`${button} ${active ? "border-foreground bg-hover" : idle} ${focusRing}`}
    >
      <Icon name={icon} active={active} className="size-6" />
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-2 h-6 w-px shrink-0 rounded-full bg-divider" />;
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
      className={`flex items-center gap-3 rounded-nav py-1 pl-1 pr-4 text-left transition-colors hover:bg-hover ${focusRing}`}
    >
      <Avatar image={me.image} letter={me.letter} className="size-9 rounded-full bg-hover" />
      <span className="hidden min-w-0 sm:block">
        <span className="block truncate text-sm font-medium leading-tight">{me.name}</span>
        {me.username && <span className="block truncate text-xs leading-tight text-muted">@{me.username}</span>}
      </span>
    </button>
  );
}

export default function Downbar() {
  return (
    <footer className="flex h-16 shrink-0 items-center px-3">
      <nav aria-label="Sections" className="flex min-w-0 items-center gap-1 overflow-x-auto">
        <NavButton href="/home" label="Home" icon="home" />
        <Divider />
        {SECTIONS.map((item) => (
          <NavButton key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1 pl-3">
        <UserChip />
        <Divider />
        <button type="button" aria-label="Inbox" title="Inbox" className={`${button} ${idle} ${focusRing}`}>
          <Icon name="inbox" className="size-6" />
        </button>
        <NavButton href="/user-settings" label="Settings" icon="settings" />
      </div>
    </footer>
  );
}