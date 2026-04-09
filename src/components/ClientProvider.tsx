"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, dir, language } = useAppStore();

  useEffect(() => {
    // Force set initial attributes on mount
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    root.dir = dir;
    root.lang = language;
    
    setMounted(true);
  }, [theme, dir, language]);

  // To prevent hydration mismatch, we don't render anything that depends on 
  // dynamic client state (like theme/lang classes) until after mount.
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ffd100] border-t-transparent shadow-[0_0_15px_rgba(255,209,0,0.5)]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
