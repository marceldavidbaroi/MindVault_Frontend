// store/userStore.ts
import { create } from "zustand";
import {
  changePasswordDto,
  CreateSecurityQuestionDto,
  DeleteSecurityQuestionDto,
  getPasskeyDto,
  resetPasswordPasskeyDto,
  UpdateProfileDto,
  User,
  UserState,
  VerifyAnswerDto,
} from "@/types/User.type";
import { userService } from "@/services/userService";
import { ApiResponse } from "@/types/ApiResponse.type";

export const useUserStore = create<UserState>((set, get) => ({
  // ---------------- USER ----------------
  user: undefined,
  initialized: false, // ✅ track if profile is already loaded
  setUser: (user) => set({ user }),

  // ---------------- PASSKEY ----------------
  passkey: undefined,
  setPasskey: (passkey) => set({ passkey }),

  // ---------------- SECURITY QUESTIONS ----------------
  securityQuestions: [],
  setSecurityQuestions: (questions) => set({ securityQuestions: questions }),

  // ---------------- PROFILE ----------------
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const res = await userService.get();
      if (res.success) {
        set({ user: res.data });

        return { success: true, data: res.data, message: "" }; // always include message
      } else {
        return {
          success: false,
          data: undefined,
          message: res.message || "Failed to fetch profile",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error?.message || "Failed to fetch profile",
      };
    }
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

  changePassword: async (data: changePasswordDto) => {
    const res = await userService.changePassword(data);
    return res;
  },

  forgetPassQuestions: async (query) => {
    const res = await userService.getQuestions(query);
    return res;
  },

  verifyAnswer: async (data: VerifyAnswerDto) => {
    const res = await userService.answerVerify(data);
    return res;
  },
}));
