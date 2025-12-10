export const TAG_GROUPS_ENDPOINTS = {
  create: "/api/v1/tags/groups",
  getAll: "/api/v1/tags/groups",
  getOne: (id: number | string) => `/api/v1/tags/groups/${id}`,
  update: (id: number | string) => `/api/v1/tags/groups/${id}`,
  delete: (id: number | string) => `/api/v1/tags/groups/${id}`,
  restore: (id: number | string) => `/api/v1/tags/groups/${id}/restore`,
  forceDelete: (id: number | string) => `/api/v1/tags/groups/${id}/force`,
};
