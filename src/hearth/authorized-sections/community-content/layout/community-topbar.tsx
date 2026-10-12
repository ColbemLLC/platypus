"use client";

import { useRouter } from "next/navigation";
import { Avatar, Icon, focusRing } from "../../../layout/kit";

// Shallow ripple hanging from the bar's bottom edge (Arc-style lining).
const scallop = "radial-gradient(ellipse 7px 5px at 50% 0, #000 98%, transparent 100%)";
const mask = {
  maskImage: scallop,
  WebkitMaskImage: scallop,
  maskSize: "14px 5px",
  WebkitMaskSize: "14px 5px",
  maskRepeat: "repeat-x",
  WebkitMaskRepeat: "repeat-x",
} as const;

export default function CommunityTopbar({ title, image }: { title: string; image?: string | null }) {
  const router = useRouter();

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center gap-4 px-5 md:px-8">
      <button
        type="button"
        onClick={() => router.push("/home")}
        className={`font-(family-name:--font-instrument-serif) text-2xl leading-none tracking-tight ${focusRing}`}
      >
        Colbe
      </button>
      <div aria-hidden className="h-5 w-px rounded-full bg-divider" />
      <div className="flex min-w-0 items-center gap-2">
        {image === undefined ? (
          <Icon name="communities" className="size-5 text-muted" />
        ) : (
          <Avatar image={image} letter={title.charAt(0).toUpperCase()} className="size-6 rounded-nav bg-hover text-sm" />
        )}
        <h2 className="truncate text-sm font-medium">{title}</h2>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full z-10 h-[5px] bg-background" style={mask} />
    </header>
  );
}