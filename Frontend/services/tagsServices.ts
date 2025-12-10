import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";

const toQueryString = (params: Record<string, any> = {}) =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

export const tagService = {
  // ==================== TAG GROUPS ====================

  createGroup: (data: any) =>
    fetcher<any>(API_ENDPOINTS.tagGroups.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAllGroups: (params?: Record<string, any>) => {
    const query = params ? `?${toQueryString(params)}` : "";
    return fetcher<any>(`${API_ENDPOINTS.tagGroups.getAll}${query}`, {
      method: "GET",
    });
  },

  getGroup: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tagGroups.getOne(id), { method: "GET" }),

  updateGroup: (id: number | string, data: any) =>
    fetcher<any>(API_ENDPOINTS.tagGroups.update(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteGroup: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tagGroups.delete(id), { method: "DELETE" }),

  restoreGroup: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tagGroups.restore(id), { method: "PATCH" }),

  forceDeleteGroup: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tagGroups.forceDelete(id), { method: "DELETE" }),

  // ==================== TAGS ====================

  createTag: (data: any) =>
    fetcher<any>(API_ENDPOINTS.tags.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAllTags: (params?: Record<string, any>) => {
    const query = params ? `?${toQueryString(params)}` : "";
    return fetcher<any>(`${API_ENDPOINTS.tags.getAll}${query}`, {
      method: "GET",
    });
  },

  getTag: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tags.getOne(id), { method: "GET" }),

  updateTag: (id: number | string, data: any) =>
    fetcher<any>(API_ENDPOINTS.tags.update(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTag: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tags.delete(id), { method: "DELETE" }),

  restoreTag: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tags.restore(id), { method: "PATCH" }),

  forceDeleteTag: (id: number | string) =>
    fetcher<any>(API_ENDPOINTS.tags.forceDelete(id), { method: "DELETE" }),
};
