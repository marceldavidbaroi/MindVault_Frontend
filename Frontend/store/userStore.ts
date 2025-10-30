// store/categoryStore.ts
import { create } from "zustand";
import { getPasskeyDto, UpdateProfileDto, UserState } from "@/types/User.type";
import { userService } from "@/services/userService";

export const useUserStore = create<UserState>((set, get) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  passkey: undefined,
  setPasskey: (passkey) => set({ passkey }),

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
    return res;
  },
  updatePreference: async (data: UpdateProfileDto) => {
    const res = await userService.updatePreference(data);
    if (res.success) {
      await get().getProfile();
    }
    return res;
  },
  getPasskey: async (data: getPasskeyDto) => {
    const res = await userService.getPasskey(data);
    if (res.success) {
      set({ passkey: res.data.passkey });
    }
    return res;
  },
}));
