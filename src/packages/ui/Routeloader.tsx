"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MorphingSquare } from "./MorphingSquare";

const ease = [0.25, 1, 0.5, 1] as const;
const STRIPS = ["a", "b", "c", "d", "e"];
const SHOW_AFTER_MS = 120; // instant navigations never flash the loader
const GIVE_UP_MS = 10000; // never get stuck if a navigation fails

/** For router.push(): window.dispatchEvent(new Event(ROUTE_LOADER_START)) */
export const ROUTE_LOADER_START = "route-loader:start";

/**
 * Full-screen loader shown while a page loads after a click.
 * When the new route is ready the screen splits into strips and slides away.
 * Mount once in the root layout.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const start = () => setPending(true);

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      start();
    };

    // Capture phase: Next's <Link> calls preventDefault, so don't check defaultPrevented.
    document.addEventListener("click", onClick, true);
    window.addEventListener(ROUTE_LOADER_START, start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(ROUTE_LOADER_START, start);
    };
  }, []);

  // The route changed, so the new page is ready.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    if (!pending) {
      setVisible(false);
      return;
    }
    const show = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    const giveUp = setTimeout(() => setPending(false), GIVE_UP_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(giveUp);
    };
  }, [pending]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-loader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-100 flex items-center justify-center"
        >
          <div aria-hidden className="absolute inset-0 flex">
            {STRIPS.map((id, i) => (
              <motion.div
                key={id}
                className="h-full flex-1 bg-background"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ y: "-100%", transition: { duration: 0.6, ease, delay: i * 0.06 } }}
              />
            ))}
          </div>
          <motion.div
            className="relative"
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.25, ease } }}
          >
            <MorphingSquare />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RouteLoader;