import type { CSSProperties, ReactNode } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/packages/db";
import { user } from "@/packages/db/schema";
import { Avatar, Icon } from "@/hearth/layout/kit";
import Shell from "@/hearth/layout/shell";

function Panel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-card border border-border bg-background p-4 ${className}`}>
      <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function UserProfile({ username }: { username: string }) {
  const [u] = await db.select().from(user).where(eq(user.username, username.toLowerCase())).limit(1);
  if (!u) notFound();

  const joined = u.createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const letter = (u.name || u.username || "").charAt(0).toUpperCase();

  return (
    <Shell>
      {/* Shell's panel is overflow-hidden, so this wrapper does the scrolling (scrollbar hidden). */}
      <div
        style={{ "--avatar": "clamp(7rem, 18vw, 9.5rem)" } as CSSProperties}
        className="notch-nav-viewport min-w-0 flex-1 overflow-y-auto"
      >
        <div className="h-36 bg-linear-to-br from-hover to-muted/60 sm:h-48">
          {u.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.banner} alt="" className="size-full object-cover" />
          )}
        </div>

        {/* z-10 keeps the picture above the banner it overlaps */}
        <div className="relative z-10 -mt-[calc(var(--avatar)/2)] flex flex-col items-center px-6 text-center">
          <div style={{ fontSize: "calc(var(--avatar) * 0.45)" }}>
            <Avatar image={u.image} letter={letter} className="size-(--avatar) rounded-full border-[6px] border-surface bg-hover" />
          </div>
          <h1 className="mt-3 font-(family-name:--font-instrument-serif) text-4xl leading-tight tracking-tight">{u.name}</h1>
          {u.username && <p className="text-sm text-muted">@{u.username}</p>}
        </div>

        <div className="mx-auto flex w-full max-w-6xl gap-4 px-4 pb-8 pt-8 md:px-6">
          {/* Mini sidebar */}
          <nav aria-label="Profile" className="sticky top-4 hidden h-fit shrink-0 flex-col gap-1 rounded-card border border-border bg-background p-1.5 sm:flex">
            <span
              aria-current="page"
              title="Overview"
              className="flex size-10 items-center justify-center rounded-nav bg-hover text-foreground"
            >
              <Icon name="home" active />
            </span>
          </nav>

          <div className="grid min-w-0 flex-1 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)_17rem]">
            <Panel title="Games" className="lg:order-1">
              <p className="text-sm text-muted">No games yet.</p>
            </Panel>

            <Panel title="Feed" className="min-h-64 lg:order-2">
              <p className="text-sm text-muted">Nothing posted yet.</p>
            </Panel>

            <Panel title="About" className="h-fit lg:order-3">
              {u.bio && <p className="mb-4 whitespace-pre-line text-sm leading-relaxed">{u.bio}</p>}
              <p className="text-xs text-muted">Joined {joined}</p>
            </Panel>
          </div>
        </div>
      </div>
    </Shell>
  );
}