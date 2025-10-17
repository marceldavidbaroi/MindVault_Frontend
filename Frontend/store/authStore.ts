import { create } from "zustand";
import { authService } from "@/services/authService";

interface AuthState {
  user: any;
  setUser: (user: any) => void;
  fetchUser: (req?: any) => Promise<void>;
  signin: (username: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // Manually set user (used for SSR hydration)
  setUser: (user) => set({ user }),

  // Fetch logged-in user (works for SSR & client)
  fetchUser: async (req?: any) => {
    try {
      //   const user = await authService.me(req);
      //   set({ user });
    } catch {
      set({ user: null });
    }
  },

  // Login (client-side only)
  signin: async (username: string, password: string) => {
    try {
      const { data } = await authService.signin(username, password);
      console.log("store", data);
      //   const user = await authService.me();
      set(data);
    } catch (error) {
      console.error("Login failed:", error);
      set({ user: null });
      throw error;
    }
  },

  // Logout (optional — resets user state)
  logout: async () => {
    set({ user: null });
    await authService.logout();
  },
}));
