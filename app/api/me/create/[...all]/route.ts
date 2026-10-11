import { headers } from "next/headers";
import { auth } from "@/packages/db/auth/auth";
import { db } from "@/packages/db";
import { community, communityMember, guild, guildMember } from "@/packages/db/schema";

const fail = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return fail("Sign in to continue.", 401);

  const body = (await req.json().catch(() => null)) as { kind?: string; name?: string; description?: string } | null;
  const kind = body?.kind;
  const name = body?.name?.trim() ?? "";
  const description = body?.description?.trim() || null;

  if (kind !== "community" && kind !== "guild") return fail("Choose a community or a guild.", 400);
  if (name.length < 2 || name.length > 40) return fail("The name must be 2 to 40 characters.", 400);
  if (description && description.length > 200) return fail("The description must be 200 characters or fewer.", 400);

  const id = crypto.randomUUID();
  const userId = session.user.id;

  if (kind === "community") {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "community";
    await db.batch([
      db.insert(community).values({ id, name, slug, description, ownerId: userId }),
      db.insert(communityMember).values({ communityId: id, userId, role: "owner" }),
    ]);
    return Response.json({ href: `/user-communities/${id}` });
  }

  await db.batch([
    db.insert(guild).values({ id, name, description, ownerId: userId }),
    db.insert(guildMember).values({ guildId: id, userId, role: "owner" }),
  ]);
  return Response.json({ href: "/guilds" });
}