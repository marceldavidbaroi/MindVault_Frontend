export const ACCOUNTS_ENDPOINTS = {
  create: "/finance/accounts",
  my: "/finance/accounts/my",
  access: "/finance/accounts/access",
  update: (id: number | string) => `/finance/accounts/${id}`,
  remove: (id: number | string) => `/finance/accounts/${id}`,
  getOne: (id: number | string) => `/finance/accounts/${id}`,
  types: {
    all: "/finance/accounts/types/all",
  },
  roles: {
    currentRole: (id: number | string) => `/finance/accounts/${id}/role`,
    assign: (id: number | string) => `/finance/accounts/${id}/roles`,
    list: (id: number | string) => `/finance/accounts/${id}/roles`,
    update: (id: number | string, userId: number | string) =>
      `/finance/accounts/${id}/roles/${userId}`,
    remove: (id: number | string, userId: number | string) =>
      `/finance/accounts/${id}/roles/${userId}`,
  },
};
