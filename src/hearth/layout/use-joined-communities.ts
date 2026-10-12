"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type JoinedCommunity = { id: string; name: string; image: string | null; members: number };

export function useJoinedCommunities() {
  const pathname = usePathname();
  const [items, setItems] = useState<JoinedCommunity[]>([]);

  useEffect(() => {
    let live = true;
    fetch("/api/me/communities")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => live && setItems(data))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [pathname]);

  return items;
}