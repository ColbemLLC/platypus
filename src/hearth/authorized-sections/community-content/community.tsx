import { notFound } from "next/navigation";
import CommunityFrame from "./community-frame";
import { getCommunity } from "./community-data";

export default async function Community({ id }: { id: string }) {
  const data = await getCommunity(id);
  if (!data) notFound();

  return <CommunityFrame data={data} />;
}