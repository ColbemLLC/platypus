import { desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/packages/db/auth/auth";
import { db } from "@/packages/db";
import { community, communityMember } from "@/packages/db/schema";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json([], { status: 401 });

  const members = sql<number>`(select count(*) from community_member m where m.community_id = ${community.id})`;

  const rows = await db
    .select({ id: community.id, name: community.name, image: community.image, members })
    .from(communityMember)
    .innerJoin(community, eq(community.id, communityMember.communityId))
    .where(eq(communityMember.userId, session.user.id))
    .orderBy(desc(members));

  return Response.json(rows.map((r) => ({ ...r, members: Number(r.members) })));
}