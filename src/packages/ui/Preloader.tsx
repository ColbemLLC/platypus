"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "@/packages/loading/loading";

type Props = {
  video?: string;
  /** How long the loader stays up before fading out. */
  durationMs?: number;
  /** Hard cap: fade out by this time even if the page is still loading. */
  maxMs?: number;
};

export default function Preloader({
  video = "/mp4-packs/cutscene2.mp4",
  durationMs = 14000,
  maxMs = 20000,
}: Props) {
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");
  const state = useRef({ loaded: false, timeDone: false });

  // Fade out once the page has loaded and the 14 seconds are up.
  const leave = useCallback(() => {
    const s = state.current;
    if (s.loaded && s.timeDone) setPhase((p) => (p === "loading" ? "leaving" : p));
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const s = state.current;

    const onLoad = () => {
      s.loaded = true;
      leave();
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const timeTimer = setTimeout(() => {
      s.timeDone = true;
      leave();
    }, durationMs);
    const maxTimer = setTimeout(() => setPhase((p) => (p === "loading" ? "leaving" : p)), maxMs);

    return () => {
      clearTimeout(timeTimer);
      clearTimeout(maxTimer);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [leave, durationMs, maxMs]);

  useEffect(() => {
    if (phase !== "leaving") return;
    document.body.style.overflow = "";
    const timer = setTimeout(() => setPhase("gone"), 700);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`fixed inset-0 z-[100] grid place-items-center bg-background text-foreground transition-opacity duration-700 ease-out ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Loading src={video} />
    </div>
  );
}