import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import {
  CreateSecurityQuestionDto,
  getPasskeyDto,
  UpdateProfileDto,
  User,
  DeleteSecurityQuestionDto,
  resetPasswordPasskeyDto, // ✅ new DTO for delete (contains password)
} from "@/types/User.type";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const userService = {
  // ---------------- PROFILE ----------------
  get: () => {
    return fetcher<ApiResponse<User>>(`${ENDPOINTS.user.profile}`, {
      method: "GET",
    });
  },

  updateProfile: (data: UpdateProfileDto) => {
    return fetcher<ApiResponse<any>>(`${ENDPOINTS.user.updateProfile}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  updatePreference: (data: any) => {
    return fetcher<ApiResponse<any>>(`${ENDPOINTS.user.updateProfile}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // ---------------- PASSKEY ----------------
  getPasskey: (data: getPasskeyDto) => {
    return fetcher<ApiResponse<any>>(`${ENDPOINTS.auth.getPasskey}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ---------------- SECURITY QUESTIONS ----------------
  getSecurityQuestion: () => {
    return fetcher<ApiResponse<any>>(`${ENDPOINTS.securityQuestions.get}`, {
      method: "GET",
    });
  },

  createSecurityQuestion: (data: CreateSecurityQuestionDto) => {
    return fetcher<ApiResponse<any>>(`${ENDPOINTS.securityQuestions.create}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSecurityQuestion: (id: number, data: CreateSecurityQuestionDto) => {
    return fetcher<ApiResponse<any>>(
      `${ENDPOINTS.securityQuestions.update(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(data), // ✅ includes password + new question + answer
      }
    );
  },

  deleteSecurityQuestion: (id: number, password: string) => {
    const payload: DeleteSecurityQuestionDto = { password };
    return fetcher<ApiResponse<any>>(
      `${ENDPOINTS.securityQuestions.delete(id)}`,
      {
        method: "DELETE",
        body: JSON.stringify(payload), // ✅ send password for verification
      }
    );
  },

  resetPasswordPasskey: (data: resetPasswordPasskeyDto) => {
    return fetcher<ApiResponse<any>>(`${ENDPOINTS.auth.resetPasswordPasskey}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
