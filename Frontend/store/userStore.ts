// store/categoryStore.ts
import { create } from "zustand";
import { UpdateProfileDto, UserState } from "@/types/User.type";
import { userService } from "@/services/userService";

export const useUserStore = create<UserState>((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  getProfile: async () => {
    const res = await userService.get();
    if (res.success) {
      set({ user: res.data });
    } else {
      throw new Error(res.message || "Failed to fetch profile");
    }
    return res;
  },

  updateProfile: async (data: UpdateProfileDto) => {
    const res = await userService.updateProfile(data);
    if (res.success) {
      await get().getProfile();
    }
  },
  updatePreference: async (data: UpdateProfileDto) => {
    const res = await userService.updatePreference(data);
    if (res.success) {
      await get().getProfile();
    }
  },
}));
