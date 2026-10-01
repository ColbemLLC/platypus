"use client";

// The bottom of the banner dissolves into the page background (same idea as the hero's fade).
const feather = "linear-gradient(to bottom, #000 75%, transparent)";

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

/** Video banner pinned to the top (scales with the device). The spinner sits on its own, dead center of the screen. */
export default function Loading({ src = "/mp4-packs/cutscene2.mp4" }: Props) {
  return (
    <div className="absolute inset-0">
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-x-0 top-0 h-[40svh] min-h-40 w-full object-cover"
        style={{ maskImage: feather, WebkitMaskImage: feather }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <Spinner />
      </div>
    </div>
  );
}