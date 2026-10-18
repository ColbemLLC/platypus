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

  const joined = u.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const letter = (u.name || u.username || "").charAt(0).toUpperCase();

  return (
    <Shell>
      {/* Shell's panel is overflow-hidden, so this wrapper does the scrolling (scrollbar hidden). */}
      <div className="notch-nav-viewport min-w-0 flex-1 overflow-y-auto px-5 py-6 md:px-8">
        <article
          style={{ "--avatar": "clamp(8rem, 24vw, 11rem)" } as CSSProperties}
          className="mx-auto w-full max-w-3xl overflow-hidden rounded-card border border-border bg-background"
        >
          <div className="h-32 bg-linear-to-br from-hover to-muted/60 sm:h-44">
            {u.banner && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.banner} alt="" className="size-full object-cover" />
            )}
          </div>

          <div className="-mt-[calc(var(--avatar)/2)] flex justify-center" style={{ fontSize: "calc(var(--avatar) * 0.45)" }}>
            <Avatar image={u.image} letter={letter} className="size-(--avatar) rounded-full border-[6px] border-background bg-hover" />
          </div>

          <div className="flex flex-col items-center px-6 pb-10 pt-4 text-center">
            <h1 className="font-(family-name:--font-instrument-serif) text-5xl leading-[1.05] tracking-tight">{u.name}</h1>
            <p className="mt-2 text-sm text-muted">
              {u.username ? `@${u.username} · ` : ""}Joined {joined}
            </p>
            {u.bio && <p className="mt-5 max-w-prose whitespace-pre-line text-sm leading-relaxed">{u.bio}</p>}
          </div>
        </article>
      </div>
    </Shell>
  );
}