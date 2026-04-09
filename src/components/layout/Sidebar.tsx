"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Package, 
  BarChart3, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "dashboard", href: "/" },
  { icon: MessageSquare, label: "chat", href: "/chat" },
  { icon: FileText, label: "content", href: "/content" },
  { icon: CheckSquare, label: "tasks", href: "/tasks" },
  { icon: Package, label: "inventory", href: "/inventory" },
  { icon: BarChart3, label: "ads", href: "/ads" },
  { icon: Settings, label: "settings", href: "/settings" },
] as const;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isSidebarCollapsed, toggleSidebar, dir } = useAppStore();
  const { user } = useAuthStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 start-0 z-50 bg-[var(--card)] text-[var(--foreground)] border-e border-[var(--border)] transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-20" : "w-64",
        isOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full lg:!translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          <div className={cn(
            "flex items-center px-6 py-8 transition-all duration-300",
            isSidebarCollapsed ? "justify-center px-0" : "justify-between"
          )}>
            {!isSidebarCollapsed && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight whitespace-nowrap"
              >
                Marketing Hub <span className="text-[#ffd100] neon-text">YK</span>
              </motion.h1>
            )}
            {isSidebarCollapsed && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd100] font-bold text-slate-900 neon-box">
                YK
              </div>
            )}
            <button onClick={onClose} className="lg:hidden text-[var(--foreground)] hover:text-[#ffd100]">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={isSidebarCollapsed ? t(item.label) : ""}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-[#ffd100] text-slate-900 shadow-lg shadow-yellow-500/20 font-bold" 
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#ffd100]",
                    isSidebarCollapsed && "justify-center px-0"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-slate-900" : "group-hover:text-[#ffd100]")} />
                  {!isSidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="whitespace-nowrap"
                    >
                      {t(item.label)}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[var(--border)] p-4">
            <button
              onClick={toggleSidebar}
              className="mb-4 hidden w-full items-center justify-center rounded-lg border border-[var(--border)] p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#ffd100] lg:flex"
            >
              {isSidebarCollapsed ? (
                dir === 'rtl' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
              ) : (
                <div className="flex items-center gap-2">
                  {dir === 'rtl' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  <span className="text-xs font-semibold uppercase">{t("collapse")}</span>
                </div>
              )}
            </button>

            <div className={cn(
              "flex items-center gap-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 p-2 transition-all",
              isSidebarCollapsed && "justify-center px-0"
            )}>
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-tr from-[#ffd100] to-yellow-600" />
              {!isSidebarCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold">{user?.name || "Yousif Khalid"}</p>
                  <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">{user?.role === "ADMIN" ? t("admin") : t("user")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
