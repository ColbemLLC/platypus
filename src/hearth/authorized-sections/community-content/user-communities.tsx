import { desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/packages/db/auth/auth";
import { db } from "@/packages/db";
import { community, communityMember } from "@/packages/db/schema";
import CommunityBackdrop from "./community-backdrop";
import CommunityCard from "./community-card";
import CommunityLayout from "./community-layout";

function Group({ title, items }: { title: string; items: Parameters<typeof CommunityCard>[0][] }) {
  return (
    <section className="w-full">
      <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nothing here yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(11rem,12rem))] justify-center gap-3">
          {items.map((c) => (
            <CommunityCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function UserCommunities() {
  const session = await auth.api.getSession({ headers: await headers() });
  const me = session?.user.id ?? "";

  const members = sql<number>`count(${communityMember.userId})`;

  const all = await db
    .select({ id: community.id, name: community.name, description: community.description, image: community.image, members })
    .from(community)
    .leftJoin(communityMember, eq(communityMember.communityId, community.id))
    .groupBy(community.id)
    .orderBy(desc(members))
    .limit(60);

  const joined = await db
    .select({ id: communityMember.communityId })
    .from(communityMember)
    .where(eq(communityMember.userId, me));

  const mine = new Set(joined.map((j) => j.id));

  const cards = all.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image,
    members: Number(c.members),
    href: `/user-communities/${c.id}`,
  }));

  return (
    <CommunityLayout title="Communities">
      <div className="relative min-w-0 flex-1">
        <CommunityBackdrop />
        <main className="relative h-full overflow-y-auto p-6 md:p-8">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <h1 className="font-(family-name:--font-instrument-serif) text-4xl tracking-tight">Communities</h1>
            <div className="mt-8 flex w-full flex-col gap-10">
              <Group title="Your communities" items={cards.filter((c) => mine.has(c.id))} />
              <Group title="Discover" items={cards.filter((c) => !mine.has(c.id))} />
            </div>
          </div>
        </main>
      </div>
    </CommunityLayout>
  );
}