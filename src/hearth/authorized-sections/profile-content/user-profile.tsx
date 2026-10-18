import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/packages/db";
import { community, communityMember, guild, guildMember, user } from "@/packages/db/schema";
import { Avatar, container } from "@/hearth/layout/kit";
import Topbar from "@/hearth/layout/Topbar";
import Downbar from "@/hearth/layout/downbar";
import Sidebar from "@/hearth/layout/sidebar";

type Item = { id: string; name: string; image: string | null; role: string; href: string };

function Section({ title, items, empty }: { title: string; items: Item[]; empty: string }) {
  return (
    <section>
      <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-card border border-border bg-surface p-3 transition-colors hover:bg-hover"
              >
                <Avatar image={item.image} letter={item.name.charAt(0).toUpperCase()} className="size-10 rounded-nav bg-hover" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span>
                {item.role !== "member" && (
                  <span className="rounded-full bg-hover px-2 py-0.5 text-xs capitalize text-muted">{item.role}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function UserProfile({ username }: { username: string }) {
  const [u] = await db.select().from(user).where(eq(user.username, username.toLowerCase())).limit(1);
  if (!u) notFound();

  const communities = await db
    .select({ id: community.id, name: community.name, image: community.image, role: communityMember.role })
    .from(communityMember)
    .innerJoin(community, eq(community.id, communityMember.communityId))
    .where(eq(communityMember.userId, u.id));

  const guilds = await db
    .select({ id: guild.id, name: guild.name, image: guild.image, role: guildMember.role })
    .from(guildMember)
    .innerJoin(guild, eq(guild.id, guildMember.guildId))
    .where(eq(guildMember.userId, u.id));

  const joined = u.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="shrink-0">
        <Topbar />
      </div>
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div className={`${container} py-6`}>
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="h-40 bg-linear-to-br from-hover to-muted/60 md:h-52">
          {u.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={u.banner} alt="" className="size-full object-cover" />
          )}
        </div>

        <div className="px-5 pb-6 md:px-8">
          <Avatar
            image={u.image}
            letter={(u.name || u.username || "").charAt(0).toUpperCase()}
            className="-mt-12 size-24 rounded-full border-4 border-surface bg-hover text-4xl"
          />
          <h1 className="mt-3 font-(family-name:--font-instrument-serif) text-4xl leading-tight tracking-tight">{u.name}</h1>
          <p className="text-sm text-muted">
            {u.username ? `@${u.username} · ` : ""}Joined {joined}
          </p>
          {u.bio && <p className="mt-4 max-w-prose whitespace-pre-line text-sm leading-relaxed">{u.bio}</p>}
        </div>
      </div>

      <div className="mt-8 grid gap-8">
        <Section title="Communities" items={communities.map((c) => ({ ...c, href: `/user-communities/${c.id}` }))} empty="Not in any communities yet." />
        <Section title="Guilds" items={guilds.map((g) => ({ ...g, href: `/guilds/${g.id}` }))} empty="Not in any guilds yet." />
      </div>
    </div>
        </main>
      </div>
      <div className="shrink-0">
        <Downbar />
      </div>
    </div>
  );
}