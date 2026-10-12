"use client";

import TopoField from "@/packages/ui/TopographicWave";

export default function CommunityBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <TopoField speed={0.5} opacity={0.22} />
    </div>
  );
}