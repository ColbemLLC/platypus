"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import Downbar from "../../../layout/downbar";
import Sidebar from "../../../layout/sidebar";
import CommunityTopbar from "./community-topbar";

export default function CommunityLayout({
  title,
  image,
  children,
}: {
  title: string;
  image?: string | null;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-svh flex-col bg-background text-foreground">
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <CommunityTopbar title={title} image={image} />
            <div className="flex min-h-0 flex-1 overflow-hidden rounded-tl-card bg-surface">{children}</div>
          </div>
        </div>
        <Downbar />
      </div>
    </MotionConfig>
  );
}