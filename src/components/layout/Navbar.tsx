"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  Globe, 
  ChevronDown,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Package,
  BarChart3,
  Settings,
  MessageSquare
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useSearchStore } from "@/store/useSearchStore";
import { Language } from "@/constants/translations";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { theme, toggleTheme, language, setLanguage } = useAppStore();
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Navigation searchable items
  const navItems = useMemo(() => [
    { id: 'dash', label: t("dashboard"), href: "/", icon: LayoutDashboard },
    { id: 'chat', label: t("chat"), href: "/chat", icon: MessageSquare },
    { id: 'cont', label: t("content"), href: "/content", icon: FileText },
    { id: 'task', label: t("tasks"), href: "/tasks", icon: CheckSquare },
    { id: 'inv', label: t("inventory"), href: "/inventory", icon: Package },
    { id: 'ads', label: t("ads"), href: "/ads", icon: BarChart3 },
    { id: 'set', label: t("settings"), href: "/settings", icon: Settings },
  ], [t]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return navItems.filter(item => 
      item.label.toLowerCase().includes(query)
    );
  }, [searchQuery, navItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "ku", label: "کوردی" },
  ];

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  const handleNavigate = (href: string) => {
    router.push(href);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-6 w-6 text-[var(--foreground)]" />
        </button>

        <div className="relative hidden items-center lg:flex max-w-md w-full" ref={searchRef}>
          <Search className="absolute left-3 h-4 w-4 text-slate-400 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-10 pr-4 text-sm text-[var(--foreground)] focus:border-[#ffd100] focus:outline-none rtl:pl-4 rtl:pr-10"
          />
          
          <AnimatePresence>
            {isSearchOpen && searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-full bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden py-2"
              >
                <div className="px-3 py-1.5">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Navigate to</p>
                </div>
                {filteredResults.length > 0 ? (
                  filteredResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.href)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-yellow-500/10 transition-colors text-left rtl:text-right"
                    >
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                        <item.icon className="h-4 w-4 text-[#ffd100]" />
                      </div>
                      <span className="font-medium text-[var(--foreground)]">{item.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center">
                    <p className="text-xs text-slate-500">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Globe className="h-5 w-5 text-[var(--foreground)]" />
            <span className="hidden text-sm font-semibold uppercase text-[var(--foreground)] lg:block">
              {language}
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 text-slate-400 transition-transform duration-200",
              isLangOpen && "rotate-180"
            )} />
          </button>
          
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl rtl:right-auto rtl:left-0"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700",
                      language === lang.code ? "bg-yellow-50 text-yellow-600 font-bold" : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#ffd100]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-[#ffd100]" />
          ) : (
            <Moon className="h-5 w-5 text-slate-500" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-[var(--foreground)]" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full border-2 border-[var(--background)] bg-red-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd100] text-sm font-bold text-slate-900">
          YK
        </div>
      </div>
    </header>
  );
};
