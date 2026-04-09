"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, dir, language } = useAppStore();

  const syncDOM = useCallback(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    root.dir = dir;
    root.lang = language;
  }, [theme, dir, language]);

  useEffect(() => {
    syncDOM();
    setMounted(true);
  }, [syncDOM]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ffd100] border-t-transparent shadow-[0_0_15px_rgba(255,209,0,0.5)]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
