export const CATEGORY_ENDPOINTS = {
  all: "/finance/categories",
  getOne: (id: number | string) => `/finance/categories/${id}`,
  create: "/finance/categories",
  update: (id: number | string) => `/finance/categories/${id}`,
  remove: (id: number | string) => `/finance/categories/${id}`,
  stats: "/finance/categories/stats/all",
};
