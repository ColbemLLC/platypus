"use client";

import { Icon } from "../../layout/kit";

export default function ChatLayout({ title }: { title: string }) {
  return (
    <section aria-label={`${title} chat`} className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-12 shrink-0 items-center gap-2 px-5">
        <Icon name="dm" className="size-5 text-muted" />
        <h2 className="truncate text-sm font-medium">{title}</h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 text-center">
        <p className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">No messages yet</p>
        <p className="mt-1 text-sm text-muted">Messaging is not available here yet.</p>
      </div>

      <div className="p-4">
        <input
          disabled
          aria-label="Message"
          placeholder="Messaging is not available yet"
          className="h-12 w-full rounded-card border border-border bg-background px-4 text-sm placeholder:text-muted disabled:cursor-not-allowed"
        />
      </div>
    </section>
  );
}