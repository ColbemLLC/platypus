"use client";

import { useEffect, useState } from "react";

export type Group = {
  id: string;
  kind: "guild" | "community" | "organization";
  name: string;
  icon: string | null;
  role: "owner" | "admin" | "member";
  owner: boolean;
};

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/me/groups")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => live && setGroups(d))
      .catch(() => {})
      .finally(() => live && setReady(true));
    return () => {
      live = false;
    };
  }, []);

  return { groups, ready };
}