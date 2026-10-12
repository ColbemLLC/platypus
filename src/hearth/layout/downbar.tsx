"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CreateDialog from "./create-dialog";
import { Avatar, Icon, SECTIONS, focusRing, isActive, type IconName } from "./kit";
import { useJoinedCommunities } from "./use-joined-communities";
import UserMenu from "./user-menu";

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

function CommunityButton({ id, name, image }: { id: string; name: string; image: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const href = `/user-communities/${id}`;
  const active = isActive(pathname, href);

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      aria-label={name}
      title={name}
      aria-current={active ? "page" : undefined}
      className={`${button} ${active ? "border-foreground bg-hover" : "border-transparent hover:bg-hover"} ${focusRing}`}
    >
      <Avatar image={image} letter={name.charAt(0).toUpperCase()} className="size-8 rounded-nav bg-surface text-sm" />
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-2 h-6 w-px shrink-0 rounded-full bg-divider" />;
}

export default function Downbar() {
  const [creating, setCreating] = useState(false);
  const close = useCallback(() => setCreating(false), []);
  const joined = useJoinedCommunities();

  return (
    <footer className="relative flex h-16 shrink-0 items-center px-3">
      <nav aria-label="Sections" className="flex min-w-0 items-center gap-1 overflow-x-auto">
        <NavButton href="/home" label="Home" icon="home" />
        <Divider />
        {SECTIONS.map((item) => (
          <NavButton key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
        <Divider />
        {joined.map((c) => (
          <CommunityButton key={c.id} id={c.id} name={c.name} image={c.image} />
        ))}
        <button
          type="button"
          onClick={() => setCreating(true)}
          aria-label="Create a community or guild"
          title="Create"
          className={`${button} ${idle} ${focusRing}`}
        >
          <Icon name="plus" className="size-6" />
        </button>
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1 pl-3">
        <UserMenu />
        <Divider />
        <button type="button" aria-label="Inbox" title="Inbox" className={`${button} ${idle} ${focusRing}`}>
          <Icon name="inbox" className="size-6" />
        </button>
        <NavButton href="/user-settings" label="Settings" icon="settings" />
      </div>

      {creating && <CreateDialog onClose={close} />}
    </footer>
  );
}