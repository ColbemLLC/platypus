import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Home - Colbe",
  description: "Created by ColbemLLC",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
