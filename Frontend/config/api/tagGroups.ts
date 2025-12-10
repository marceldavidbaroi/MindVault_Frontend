export const TAG_GROUPS_ENDPOINTS = {
  create: "/tags/groups",
  getAll: "/tags/groups",
  getOne: (id: number | string) => `/tags/groups/${id}`,
  update: (id: number | string) => `/tags/groups/${id}`,
  delete: (id: number | string) => `/tags/groups/${id}`,
  restore: (id: number | string) => `/tags/groups/${id}/restore`,
  forceDelete: (id: number | string) => `/tags/groups/${id}/force`,
};
