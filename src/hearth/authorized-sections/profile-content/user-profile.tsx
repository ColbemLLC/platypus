import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/packages/db";
import { user } from "@/packages/db/schema";
import { Avatar } from "@/hearth/layout/kit";
import Shell from "@/hearth/layout/shell";

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
        {/* Banner runs edge to edge */}
        <div className="relative h-36 bg-linear-to-br from-hover to-muted/60 sm:h-48">
          {u.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.banner} alt="" className="size-full object-cover" />
          )}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-surface/50 to-transparent" />
        </div>

        {/* Picture centered on the banner edge, then name and username */}
        <div className="-mt-[calc(var(--avatar)/2)] flex flex-col items-center px-6 text-center">
          <div style={{ fontSize: "calc(var(--avatar) * 0.45)" }}>
            <Avatar image={u.image} letter={letter} className="size-(--avatar) rounded-full border-[6px] border-surface bg-hover" />
          </div>
          <h1 className="mt-3 font-(family-name:--font-instrument-serif) text-4xl leading-tight tracking-tight">{u.name}</h1>
          {u.username && <p className="text-sm text-muted">@{u.username}</p>}
        </div>

        {/* Mini sidebar on the left */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 pb-8 pt-8 md:flex-row md:px-8">
          <aside className="w-full shrink-0 md:w-56">
            <div className="rounded-card border border-border bg-background p-4">
              <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">About</h2>
              {u.bio && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{u.bio}</p>}
              <p className={`text-xs text-muted ${u.bio ? "mt-4" : "mt-3"}`}>Joined {joined}</p>
            </div>
          </aside>
          <div className="min-w-0 flex-1" />
        </div>
      </div>
    </Shell>
  );
}