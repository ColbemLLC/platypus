import { notFound } from "next/navigation";
import CommunityFrame from "./layout/community-frame";
import CommunityLayout from "./layout/community-layout";
import { getCommunity } from "./data/community-data";

export default async function Community({ id }: { id: string }) {
  const data = await getCommunity(id);
  if (!data) notFound();

  return (
    <CommunityLayout title={data.name} image={data.image}>
      <CommunityFrame data={data} />
    </CommunityLayout>
  );
}