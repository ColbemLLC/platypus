"use client";

import { useRouter } from "next/navigation";
import { Avatar, focusRing } from "../../../layout/kit";

export type CommunityCardData = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  members: number;
  joined: boolean;
  href: string;
};

export default function CommunityCard({ name, description, image, banner, members, joined, href }: CommunityCardData) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={`group flex h-full flex-col overflow-hidden rounded-card border border-border bg-background text-left transition-colors hover:bg-hover ${focusRing}`}
    >
      <span className="block h-28 w-full shrink-0 bg-hover">
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner} alt="" className="size-full object-cover" />
        )}
      </span>

      <span className="-mt-8 ml-4 block w-fit rounded-card border-4 border-background transition-colors group-hover:border-hover">
        <Avatar image={image} letter={name.charAt(0).toUpperCase()} className="size-16 rounded-nav bg-surface text-2xl" />
      </span>

      <span className="mt-3 block truncate px-4 font-medium">{name}</span>
      <span className="line-clamp-3 block flex-1 px-4 pt-1 text-sm text-muted">{description}</span>

      <span className="flex items-center gap-2 px-4 pb-4 pt-5 text-xs text-muted">
        <span aria-hidden className="size-2 rounded-full bg-muted" />
        {members.toLocaleString("en-US")} {members === 1 ? "member" : "members"}
        {joined && <span className="ml-auto font-medium text-foreground">Joined</span>}
      </span>
    </button>
  );
}