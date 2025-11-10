import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import { Role } from "@/types/Roles.type";
import { ApiResponse } from "@/types/ApiResponse.type";

export const roleService = {
  getAll: () => {
    return fetcher<ApiResponse<Role[]>>(`${ENDPOINTS.roles.getAll}`, {
      method: "GET",
    });
  },

  getOne: (id: number | string) =>
    fetcher<ApiResponse<Role>>(ENDPOINTS.roles.getOne(id), {
      method: "GET",
    }),
};
