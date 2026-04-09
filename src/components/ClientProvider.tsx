"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, dir, language } = useAppStore();

  useEffect(() => {
    // Sync initial state to DOM
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    root.dir = dir;
    root.lang = language;
    
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ffd100] border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
