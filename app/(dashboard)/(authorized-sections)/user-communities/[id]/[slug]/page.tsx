import Community from "@/hearth/authorized-sections/community-content/community";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  return <Community id={id} slug={slug} />;
}