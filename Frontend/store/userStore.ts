// store/userStore.ts
import { create } from "zustand";
import {
  CreateSecurityQuestionDto,
  DeleteSecurityQuestionDto,
  getPasskeyDto,
  resetPasswordPasskeyDto,
  UpdateProfileDto,
  UserState,
} from "@/types/User.type";
import { userService } from "@/services/userService";

export const useUserStore = create<UserState>((set, get) => ({
  // ---------------- USER ----------------
  user: undefined,
  setUser: (user) => set({ user }),

  // ---------------- PASSKEY ----------------
  passkey: undefined,
  setPasskey: (passkey) => set({ passkey }),

  // ---------------- SECURITY QUESTIONS ----------------
  securityQuestions: [],
  setSecurityQuestions: (questions) => set({ securityQuestions: questions }),

  // ---------------- PROFILE ----------------
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

  // ---------------- PASSKEY ----------------
  getPasskey: async (data: getPasskeyDto) => {
    const res = await userService.getPasskey(data);
    if (res.success) {
      set({ passkey: res.data.passkey });
    }
    return res;
  },

  // ---------------- SECURITY QUESTIONS ----------------
  getSecurityQuestion: async () => {
    const res = await userService.getSecurityQuestion();
    if (res.success) {
      get().setSecurityQuestions(res.data);
    }
    return res;
  },

  createSecurityQuestion: async (data: CreateSecurityQuestionDto) => {
    const res = await userService.createSecurityQuestion(data);
    if (res.success) {
      await get().getSecurityQuestion(); // refresh after create
    }
    return res;
  },

  updateSecurityQuestion: async (
    id: number,
    data: CreateSecurityQuestionDto
  ) => {
    const res = await userService.updateSecurityQuestion(id, data);
    if (res.success) {
      await get().getSecurityQuestion(); // refresh after update
    }
    return res;
  },

  deleteSecurityQuestion: async (
    id: number,
    dto: DeleteSecurityQuestionDto
  ) => {
    const res = await userService.deleteSecurityQuestion(id, dto.password);
    if (res.success) {
      await get().getSecurityQuestion(); // refresh after delete
    }
    return res;
  },

  resetPasswordPasskey: async (data: resetPasswordPasskeyDto) => {
    const res = await userService.resetPasswordPasskey(data);
    return res;
  },
}));
