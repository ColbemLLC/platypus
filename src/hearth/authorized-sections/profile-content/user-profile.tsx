import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/packages/db";
import { user } from "@/packages/db/schema";
import { Avatar } from "@/hearth/layout/kit";
import Topbar from "@/hearth/layout/Topbar";
import Downbar from "@/hearth/layout/downbar";
import Sidebar from "@/hearth/layout/sidebar";

export default async function UserProfile({ username }: { username: string }) {
  const [u] = await db.select().from(user).where(eq(user.username, username.toLowerCase())).limit(1);
  if (!u) notFound();

  const joined = u.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const letter = (u.name || u.username || "").charAt(0).toUpperCase();

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="shrink-0">
        <Topbar />
      </div>

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto px-5 py-6 pb-6 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden">
          <article
            // The avatar scales with the screen; the banner overlap follows it.
            style={{ "--avatar": "clamp(8rem, 28vw, 12rem)" } as CSSProperties}
            className="mx-auto w-full max-w-3xl overflow-hidden rounded-[15px] border border-foreground/15 bg-background"
          >
            <div className="h-32 bg-linear-to-br from-primary/50 via-primary/25 to-muted sm:h-44 md:h-52">
              {u.banner && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.banner} alt="" className="size-full object-cover" />
              )}
            </div>

            <div className="-mt-[calc(var(--avatar)/2)] flex justify-center" style={{ fontSize: "calc(var(--avatar) * 0.45)" }}>
              <Avatar
                image={u.image}
                letter={letter}
                className="size-(--avatar) rounded-full border-[6px] border-background bg-muted"
              />
            </div>

            <div className="flex flex-col items-center px-6 pb-10 pt-4 text-center">
              <h1 className="font-(family-name:--font-instrument-serif) text-5xl leading-[1.05] tracking-[-0.025em]">{u.name}</h1>
              <p className="mt-2 text-sm text-muted">
                {u.username ? `@${u.username} · ` : ""}Joined {joined}
              </p>
              {u.bio && <p className="mt-5 max-w-prose whitespace-pre-line text-sm leading-relaxed">{u.bio}</p>}
            </div>
          </article>
        </main>
      </div>

      <div className="shrink-0">
        <Downbar />
      </div>
    </div>
  );
}