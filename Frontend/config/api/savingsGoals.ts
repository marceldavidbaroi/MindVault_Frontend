export const SAVINGS_GOALS_ENDPOINTS = {
  create: "/finance/savings-goals",
  my: "/finance/savings-goals/my",
  getOne: (id: number | string) => `/finance/savings-goals/${id}`,
  update: (id: number | string) => `/finance/savings-goals/${id}`,
  remove: (id: number | string) => `/finance/savings-goals/${id}`,
};
