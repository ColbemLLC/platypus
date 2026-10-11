import { notFound } from "next/navigation";
import CommunityFrame from "./community-frame";
import CommunityLayout from "./community-layout";
import { getCommunity } from "./community-data";

export default async function Community({ id }: { id: string }) {
  const data = await getCommunity(id);
  if (!data) notFound();

  return (
    <CommunityLayout title={data.name} image={data.image}>
      <CommunityFrame data={data} />
    </CommunityLayout>
  );
}