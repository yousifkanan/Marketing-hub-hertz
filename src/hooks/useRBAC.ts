import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/types";

export const useRBAC = () => {
  const { user } = useAuthStore();

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => user?.role === "ADMIN";

  return { hasRole, isAdmin, user };
};
