"use client";

import Link from "next/link";
import { type Card, Avatar, Icon, SECTIONS, Skeleton, YOU, container, focusRing, useMe } from "./layout/kit";
import Shell from "./layout/shell";

const CARDS: Card[] = [...SECTIONS, YOU[0]];

function Hero() {
  const me = useMe();

  return (
    <>
      <div className="h-28 shrink-0 bg-linear-to-br from-primary/50 via-primary/25 to-muted sm:h-36 md:h-40" />

      <div className={`${container} -mt-14 flex flex-col items-center text-center sm:-mt-16`}>
        <Avatar
          image={me.image}
          letter={me.letter}
          className="size-28 rounded-[15px] border-4 border-background bg-foreground/10 text-5xl sm:size-32"
        />

        {me.ready ? (
          <div className="mt-4">
            <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
              Welcome back, <span className="italic text-foreground/60">{me.name}</span>
            </h1>
            {me.username && <p className="mt-2 text-sm text-muted-foreground">@{me.username}</p>}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-24" />
          </div>
        )}
      </div>
    </>
  );
}

function SectionCard({ item }: { item: Card }) {
  return (
    <Link
      href={item.href}
      className={`flex h-full flex-col gap-5 rounded-[15px] border border-border bg-foreground/[0.03] p-5 transition-colors hover:border-foreground/30 hover:bg-foreground/[0.07] ${focusRing}`}
    >
      <span className="flex size-10 items-center justify-center rounded-nav border border-border bg-background/60">
        <Icon name={item.icon} />
      </span>
      <div>
        <h3 className="font-[family-name:var(--font-instrument-serif)] text-2xl leading-tight tracking-[-0.025em]">{item.label}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.blurb}</p>
      </div>
    </Link>
  );
}

function JumpIn() {
  return (
    <section aria-labelledby="jump-in" className={`${container} mt-12 pb-16`}>
      <h2 id="jump-in" className="font-[family-name:var(--font-instrument-serif)] text-3xl tracking-[-0.025em]">
        Jump <span className="italic text-foreground/60">in.</span>
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((item) => (
          <SectionCard key={item.href} item={item} />
        ))}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm">{value}</dd>
    </div>
  );
}

function About() {
  const me = useMe();

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-border p-4 xl:block">
      <div className="rounded-[15px] border border-border bg-foreground/[0.03] p-5">
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl tracking-[-0.025em]">About you</h2>

        {me.ready ? (
          <dl className="mt-5 flex flex-col gap-4">
            <Row label="Name" value={me.name} />
            {me.username && <Row label="Username" value={`@${me.username}`} />}
            {me.joined && <Row label="Joined" value={me.joined} />}
          </dl>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/user-profile"
            className={`inline-flex h-10 items-center justify-center rounded-nav bg-cta px-4 text-sm font-semibold text-cta-foreground transition-colors hover:opacity-90 ${focusRing}`}
          >
            Edit profile
          </Link>
          <Link
            href="/user-settings"
            className={`inline-flex h-10 items-center justify-center rounded-nav border border-foreground/25 bg-foreground/10 px-4 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-foreground/20 ${focusRing}`}
          >
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <Shell>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Hero />
        <JumpIn />
      </main>
      <About />
    </Shell>
  );
}