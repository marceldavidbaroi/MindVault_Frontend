import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";
import { Role } from "@/types/Roles.type";
import { ApiResponse } from "@/types/ApiResponse.type";

export const roleService = {
  getAll: () => {
    return fetcher<ApiResponse<Role[]>>(`${API_ENDPOINTS.roles.getAll}`, {
      method: "GET",
    });
  },

  getOne: (id: number | string) =>
    fetcher<ApiResponse<Role>>(API_ENDPOINTS.roles.getOne(id), {
      method: "GET",
    }),
};
