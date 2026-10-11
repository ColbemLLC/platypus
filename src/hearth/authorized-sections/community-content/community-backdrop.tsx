"use client";

import TopoField from "@/packages/ui/TopographicWave";

export default function CommunityBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <TopoField mode="auto" opacity={0.5} speed={0.6} />
    </div>
  );
}