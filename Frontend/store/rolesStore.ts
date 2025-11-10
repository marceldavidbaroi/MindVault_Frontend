import { create } from "zustand";
import { roleService } from "@/services/rolesService";
import { Role } from "@/types/Roles.type";
import { ApiResponse } from "@/types/ApiResponse.type";

interface RoleState {
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  getAllRoles: () => Promise<ApiResponse<Role[]>>;
}

export const useRoleStore = create<RoleState>((set) => ({
  // --- State ---
  roles: [],

  // --- Setters ---
  setRoles: (roles) => set({ roles }),

  // --- Actions ---
  /**
   * Fetches all roles, updates the store state on success, and returns the API response.
   */
  getAllRoles: async () => {
    const res = await roleService.getAll();
    if (res.success && res.data) {
      set({ roles: res.data });
    }
    return res;
  },
}));
