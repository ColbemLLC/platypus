import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/packages/db/auth/auth";
import { db } from "@/packages/db";
import { community, communityMember, user } from "@/packages/db/schema";

export type Role = "owner" | "admin" | "member";

export type Member = { id: string; name: string; username: string | null; image: string | null; role: Role };

export type CommunityView = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  since: string;
  members: Member[];
  viewerRole: Role | null;
};

export const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "community";

export async function getCommunity(id: string): Promise<CommunityView | null> {
  const [row] = await db.select().from(community).where(eq(community.id, id)).limit(1);
  if (!row) return null;

  const members = await db
    .select({ id: user.id, name: user.name, username: user.username, image: user.image, role: communityMember.role })
    .from(communityMember)
    .innerJoin(user, eq(user.id, communityMember.userId))
    .where(eq(communityMember.communityId, id));

  const session = await auth.api.getSession({ headers: await headers() });
  const viewerRole = members.find((m) => m.id === session?.user.id)?.role ?? null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    banner: row.banner,
    since: row.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    members,
    viewerRole,
  };
}