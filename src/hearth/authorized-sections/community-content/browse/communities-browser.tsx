"use client";

import { useMemo, useState } from "react";
import { focusRing } from "../../../layout/kit";
import CommunityCard, { type CommunityCardData } from "./community-card";

function Section({ title, items }: { title: string; items: CommunityCardData[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-(family-name:--font-instrument-serif) text-3xl tracking-tight">{title}</h2>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
        {items.map((c) => (
          <CommunityCard key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
}

export default function CommunitiesBrowser({ communities }: { communities: CommunityCardData[] }) {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter((c) => c.name.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q));
  }, [communities, query]);

  const mine = shown.filter((c) => c.joined);
  const rest = shown.filter((c) => !c.joined);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10">
      <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h1 className="font-(family-name:--font-instrument-serif) text-5xl leading-[1.05] tracking-tight">
          Find your <span className="italic text-foreground/60">community</span>
        </h1>
        <p className="mt-3 text-muted">Browse communities and join the ones that fit.</p>

        <label className="relative mt-6 block w-full max-w-md">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities"
            aria-label="Search communities"
            className={`h-11 w-full rounded-nav border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted ${focusRing}`}
          />
        </label>
      </header>

      {communities.length === 0 ? (
        <p className="mt-16 text-center text-muted">No communities yet.</p>
      ) : shown.length === 0 ? (
        <p className="mt-16 text-center text-muted">{`No communities match "${query.trim()}".`}</p>
      ) : (
        <>
          <Section title="Your communities" items={mine} />
          <Section title="Discover" items={rest} />
        </>
      )}
    </div>
  );
}