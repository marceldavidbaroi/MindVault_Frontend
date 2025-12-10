export const TAGS_ENDPOINTS = {
  create: "/api/v1/tags",
  getAll: "/api/v1/tags",
  getOne: (id: number | string) => `/api/v1/tags/${id}`,
  update: (id: number | string) => `/api/v1/tags/${id}`,
  delete: (id: number | string) => `/api/v1/tags/${id}`,
  restore: (id: number | string) => `/api/v1/tags/${id}/restore`,
  forceDelete: (id: number | string) => `/api/v1/tags/${id}/force`,
};
