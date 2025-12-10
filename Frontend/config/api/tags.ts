export const TAGS_ENDPOINTS = {
  create: "/tags",
  getAll: "/tags",
  getOne: (id: number | string) => `/tags/${id}`,
  update: (id: number | string) => `/tags/${id}`,
  delete: (id: number | string) => `/tags/${id}`,
  restore: (id: number | string) => `/tags/${id}/restore`,
  forceDelete: (id: number | string) => `/tags/${id}/force`,
};
