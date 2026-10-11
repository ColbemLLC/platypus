"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/packages/db/auth/client";
import { Avatar, Icon, Skeleton, focusRing, useMe, type IconName } from "./kit";

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function Row({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex h-10 w-full items-center gap-3 rounded-nav px-3 text-left text-sm transition-colors hover:bg-hover ${focusRing}`}
    >
      {children}
    </button>
  );
}

function NavRow({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <Row onClick={onClick}>
      <Icon name={icon} className="size-5 text-muted" />
      {label}
    </Row>
  );
}

export default function UserMenu() {
  const me = useMe();
  const { data } = authClient.useSession();
  const id = data?.user.id ?? "";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  if (!me.ready) return <Skeleton className="h-10 w-36" />;

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const signOut = () => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } });

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Your account"
        className={`flex items-center gap-3 rounded-nav py-1 pl-1 pr-4 text-left transition-colors hover:bg-hover ${open ? "bg-hover" : ""} ${focusRing}`}
      >
        <Avatar image={me.image} letter={me.letter} className="size-9 rounded-full bg-hover" />
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-medium leading-tight">{me.name}</span>
          {me.username && <span className="block truncate text-xs leading-tight text-muted">@{me.username}</span>}
        </span>
      </button>

      {open && (
        <div role="menu" className="absolute bottom-full right-0 mb-3 w-72 rounded-card border border-border bg-surface p-2 shadow-lg">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar image={me.image} letter={me.letter} className="size-12 rounded-full bg-hover text-xl" />
            <div className="min-w-0">
              <p className="truncate font-(family-name:--font-instrument-serif) text-2xl leading-tight tracking-tight">{me.name}</p>
              {me.username && <p className="truncate text-sm text-muted">@{me.username}</p>}
              {me.joined && <p className="text-xs text-muted">Joined {me.joined}</p>}
            </div>
          </div>

          <div className="rounded-nav bg-background p-1">
            <NavRow icon="profile" label="Edit profile" onClick={() => go("/user-profile")} />
            <NavRow icon="settings" label="Settings" onClick={() => go("/user-settings")} />
          </div>

          <div className="mt-2 rounded-nav bg-background p-1">
            <Row onClick={copy}>
              <span className="text-muted">
                <Glyph>
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h8" />
                </Glyph>
              </span>
              {copied ? "Copied" : "Copy user ID"}
            </Row>
            <Row onClick={signOut}>
              <span className="text-muted">
                <Glyph>
                  <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
                  <path d="M16 8l4 4-4 4M20 12H9" />
                </Glyph>
              </span>
              Sign out
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}