import { desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/packages/db/auth/auth";
import { db } from "@/packages/db";
import { community, communityMember } from "@/packages/db/schema";
import CommunitiesBrowser from "./communities-browser";
import CommunityBackdrop from "./community-backdrop";
import CommunityLayout from "./community-layout";

export default async function UserCommunities() {
  const session = await auth.api.getSession({ headers: await headers() });
  const me = session?.user.id ?? "";

  const members = sql<number>`count(${communityMember.userId})`;

  const all = await db
    .select({
      id: community.id,
      name: community.name,
      description: community.description,
      image: community.image,
      banner: community.banner,
      members,
    })
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

  const communities = all.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image,
    banner: c.banner,
    members: Number(c.members),
    joined: mine.has(c.id),
    href: `/user-communities/${c.id}`,
  }));

  return (
    <CommunityLayout title="Communities">
      <div className="relative min-w-0 flex-1">
        <CommunityBackdrop />
        <main className="relative h-full overflow-y-auto">
          <CommunitiesBrowser communities={communities} />
        </main>
      </div>
    </CommunityLayout>
  );
}