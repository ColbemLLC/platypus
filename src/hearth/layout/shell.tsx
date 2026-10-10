"use client";

import "../../../app/global.css";
import "../../../app/layout";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import Downbar from "./downbar";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";

/** One frame for home and every (authorized-sections) page: sidebar, topbar, content, downbar. */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-svh flex-col bg-background text-foreground">
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <div className="flex min-h-0 flex-1">{children}</div>
          </div>
        </div>
        <Downbar />
      </div>
    </MotionConfig>
  );
}