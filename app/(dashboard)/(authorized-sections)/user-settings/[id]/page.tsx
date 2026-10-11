import UserSettings from "@/hearth/authorized-sections/setting-content/user-settings";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserSettings id={id} />;
}