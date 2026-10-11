"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import Downbar from "./downbar";
import Sidebar from "./sidebar";
import Topbar from "./Topbar";
import { TopbarProvider } from "./topbar-content";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <TopbarProvider>
        <div className="flex h-svh flex-col bg-background text-foreground">
          <div className="flex min-h-0 flex-1">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Topbar />
              <div className="flex min-h-0 flex-1 overflow-hidden rounded-tl-card bg-surface">{children}</div>
            </div>
          </div>
          <Downbar />
        </div>
      </TopbarProvider>
    </MotionConfig>
  );
}