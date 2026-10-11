"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TopbarEntry = { label: string; image: string | null; letter: string };

type Value = { entry: TopbarEntry | null; set: (entry: TopbarEntry | null) => void };

const TopbarContext = createContext<Value>({ entry: null, set: () => {} });

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [entry, set] = useState<TopbarEntry | null>(null);
  return <TopbarContext.Provider value={{ entry, set }}>{children}</TopbarContext.Provider>;
}

export const useTopbarEntry = () => useContext(TopbarContext).entry;

export function useSetTopbar(entry: { label: string; image: string | null } | null) {
  const { set } = useContext(TopbarContext);
  const label = entry?.label;
  const image = entry?.image ?? null;

  useEffect(() => {
    set(label ? { label, image, letter: label.charAt(0).toUpperCase() } : null);
    return () => set(null);
  }, [set, label, image]);
}