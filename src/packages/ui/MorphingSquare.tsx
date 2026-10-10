"use client";

import { type HTMLMotionProps, motion } from "motion/react";

const placements = {
  bottom: "flex-col",
  top: "flex-col-reverse",
  right: "flex-row",
  left: "flex-row-reverse",
} as const;

export interface MorphingSquareProps {
  message?: string;
  /** Position of the message relative to the spinner. @default bottom */
  messagePlacement?: keyof typeof placements;
}

// Same loader as the template, minus class-variance-authority and cn so it needs no extra packages.
export function MorphingSquare({
  className = "",
  message,
  messagePlacement = "bottom",
  ...props
}: HTMLMotionProps<"div"> & MorphingSquareProps) {
  const color = className.includes("bg-") ? "" : "bg-foreground";

  return (
    <div className={`flex items-center justify-center gap-2 ${placements[messagePlacement]}`}>
      <motion.div
        className={`size-10 ${color} ${className}`}
        animate={{ borderRadius: ["6%", "50%", "6%"], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        {...props}
      />
      {message && <div>{message}</div>}
    </div>
  );
}

export default MorphingSquare;