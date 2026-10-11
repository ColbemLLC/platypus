import type { ReactNode } from "react";
import Shell from "@/hearth/layout/shell";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}