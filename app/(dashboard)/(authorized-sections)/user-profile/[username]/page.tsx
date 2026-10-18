import UserProfile from "@/hearth/authorized-sections/profile-content/user-profile";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <UserProfile username={decodeURIComponent(username)} />;
}