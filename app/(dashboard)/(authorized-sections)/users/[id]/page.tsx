import UserProfile from "@/hearth/authorized-sections/profile-content/user-profile";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfile id={id} />;
}