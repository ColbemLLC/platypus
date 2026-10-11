"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/packages/db/auth/client";
import { Avatar, Skeleton, focusRing, useMe } from "./kit";

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <div ref={root}>
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
        <div
          role="menu"
          className="fixed bottom-[4.75rem] right-3 z-50 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-card border border-border bg-surface shadow-lg"
        >
          <div className="h-24 bg-linear-to-br from-hover to-muted/60" />

          <div className="flex flex-col items-center px-4 pb-4 text-center">
            <Avatar image={me.image} letter={me.letter} className="-mt-10 size-20 rounded-full border-4 border-surface bg-hover text-3xl" />
            <p className="mt-3 max-w-full truncate font-(family-name:--font-instrument-serif) text-3xl leading-tight tracking-tight">{me.name}</p>
            {me.username && <p className="max-w-full truncate text-sm text-muted">@{me.username}</p>}
            {me.joined && <p className="mt-1 text-xs text-muted">Joined {me.joined}</p>}
          </div>

          <div className="mx-2 mb-2 rounded-nav bg-background p-1">
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