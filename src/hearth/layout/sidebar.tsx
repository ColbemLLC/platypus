"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { focusRing } from "./kit";

export default function Sidebar() {
  const router = useRouter();

  return (
    <nav aria-label="Colbe" className="hidden w-[72px] shrink-0 flex-col items-center gap-3 overflow-y-auto py-3 sm:flex">
      <button
        type="button"
        onClick={() => router.push("/")}
        aria-label="Colbe welcome page"
        title="Colbe"
        className={`rounded-card p-1.5 transition-colors hover:bg-hover ${focusRing}`}
      >
        <Image src="/favicon.ico" alt="" width={36} height={36} unoptimized className="size-9 rounded-nav" />
      </button>
      <span aria-hidden className="h-px w-8 rounded-full bg-divider" />
    </nav>
  );
}