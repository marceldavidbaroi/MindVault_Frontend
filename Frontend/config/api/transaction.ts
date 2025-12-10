export const TRANSACTION_ENDPOINTS = {
  getAll: (accountId: number) => `/transactions/${accountId}/transactions`,
  getOne: (id: number | string) => `/transactions/${id}`,
  create: "/transactions",
  createBulk: "/transactions/bulk",
  update: (id: number | string) => `/transactions/${id}`,
  remove: (id: number | string) => `/transactions/${id}`,
  statements: (accountId: number | string) =>
    `/transactions/${accountId}/statement`,
};
