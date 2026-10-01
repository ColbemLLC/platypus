"use client";

import { useState } from "react";

// Soft edge so the video dissolves into the page background (same idea as the hero's fade).
const feather = "radial-gradient(ellipse at center, #000 45%, transparent 100%)";

type Props = { src?: string; brand?: string };

/** Video centered on half the viewport. It scales with the device/browser size and keeps its aspect ratio. */
export default function Loading({ src = "/mp4-packs/cutscene2.mp4", brand = "Colbe" }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative grid h-[50svh] min-h-48 w-[50vw] min-w-72 place-items-center">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onError={() => setPlaying(false)}
        className="absolute inset-0 size-full object-contain"
        style={{ maskImage: feather, WebkitMaskImage: feather }}
      />
      {/* Fallback while the video starts, or if it fails to load. */}
      {!playing && (
        <span className="relative font-[family-name:var(--font-instrument-serif)] text-6xl tracking-tight md:text-7xl">
          {brand}
        </span>
      )}
    </div>
  );
}