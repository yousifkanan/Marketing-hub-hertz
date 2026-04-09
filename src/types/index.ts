import { Language } from "@/constants/translations";

export type { Language };
export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  position?: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, token: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

export interface AppState {
  language: Language;
  dir: "ltr" | "rtl";
  theme: "dark" | "light";
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}
