"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, dir, language, isSidebarCollapsed } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    root.dir = dir;
    root.lang = language;
    
    // Set explicit background for body via variable
    root.style.setProperty('--current-theme', theme);
  }, [theme, dir, language]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 overflow-x-hidden">
      {/* Sidebar Component handles its own desktop visibility and mobile overlay */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        // Padding is added based on sidebar state for Desktop (lg)
        isSidebarCollapsed ? "lg:ps-20" : "lg:ps-64"
      )}>
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
