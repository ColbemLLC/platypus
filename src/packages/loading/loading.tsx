"use client";

// Top and bottom of the banner dissolve into the page background (same idea as the hero's fade).
const feather = "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)";

type Props = { src?: string };

/** Windows-style spinner: five dots chase each other around a ring. Pure SVG, no CSS needed. */
function Spinner() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      aria-hidden
      className="relative text-white drop-shadow-[0_1px_8px_rgb(0_0_0/0.5)]"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx="24" cy="5" r="3" fill="currentColor" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 24 24"
            to="360 24 24"
            dur="2.4s"
            begin={`${-i * 0.16}s`}
            repeatCount="indefinite"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.4 0 0.2 1"
          />
        </g>
      ))}
    </svg>
  );
}

/** Full-width banner across the center of the screen (scales with the device), spinner in the middle. */
export default function Loading({ src = "/mp4-packs/cutscene2.mp4" }: Props) {
  return (
    <div className="relative grid h-[50svh] min-h-48 w-screen place-items-center">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover"
        style={{ maskImage: feather, WebkitMaskImage: feather }}
      />
      <Spinner />
    </div>
  );
}