import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, Language } from "@/types";

interface ExtendedAppState extends AppState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<ExtendedAppState>()(
  persist(
    (set) => ({
      language: "en",
      dir: "ltr",
      theme: "dark",
      isSidebarCollapsed: false,
      setLanguage: (language: Language) => {
        const dir = (language === "ar" || language === "ku") ? "rtl" : "ltr";
        set({ language, dir });
      },
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
      toggleSidebar: () => 
        set((state) => ({ 
          isSidebarCollapsed: !state.isSidebarCollapsed 
        })),
    }),
    {
      name: "app-storage",
    }
  )
);
