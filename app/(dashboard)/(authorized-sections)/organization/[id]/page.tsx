import OrganizationPage from "@/hearth/authorized-sections/organization-content/organization-page";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  return <OrganizationPage id={id} slug={slug} />;
}