import Community from "@/hearth/authorized-sections/community-content/community";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Community id={id} />;
}