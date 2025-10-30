import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import { UpdateProfileDto, User } from "@/types/User.type";

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
};
