"use client";

import { useRouter } from "next/navigation";
import { Avatar, focusRing } from "../../layout/kit";

export default function CommunityCard({
  name,
  description,
  image,
  members,
  href,
}: {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  members: number;
  href: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={`flex flex-col items-center rounded-card border border-border bg-background p-4 text-center transition-colors hover:bg-hover ${focusRing}`}
    >
      <Avatar image={image} letter={name.charAt(0).toUpperCase()} className="size-16 rounded-nav bg-surface text-2xl" />
      <span className="mt-3 w-full truncate font-medium">{name}</span>
      <span className="text-xs text-muted">
        {members} {members === 1 ? "member" : "members"}
      </span>
      {description && <span className="mt-2 line-clamp-2 text-sm text-muted">{description}</span>}
    </button>
  );
}