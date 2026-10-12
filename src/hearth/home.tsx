"use client";

import TopoField from "@/packages/ui/TopographicWave";

export default function Home() {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto relative">
      {/* Background Graphic */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <TopoField speed={0.5} opacity={0.22} />
      </div>

      {/* Your page content goes here */}
    </main>
  );
}