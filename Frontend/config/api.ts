export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  auth: {
    signin: "/auth/signin",
    signup: "/auth/signup",
    logout: "/auth/logout",
    me: "/auth/me",
    getPasskey: "/auth/passkey",
    resetPasswordPasskey: "/auth/passkey/reset",
    changePassword: "/auth/passkey/change",
    getQuestions: (username: string) =>
      `/auth/forgot-password/${username}/questions`,
    answerVerify: (username: string) =>
      `/auth/forgot-password/${username}/verify`,
  },
  summary: {
    // transactionDashboard: "/summary/transaction-dashboard",
    dashboard_comparison: (accountId: number | string) =>
      `/summaries/${accountId}/comparison`,
    dailyCategorySummary: (accountId: number) =>
      `/summaries/${accountId}/daily`,
    monthlyCategorySummary: (accountId: number) =>
      `/summaries/${accountId}/monthly`,
  },
  transaction: {
    // all: "/transactions", // GET all transactions with filters & pagination
    getAll: (accountId: number) => `/transactions/${accountId}/transactions`,
    getOne: (id: number | string) => `/transactions/${id}`, // GET single transaction
    create: "/transactions", // POST create transaction
    createBulk: "/transactions/bulk", // POST bulk create
    update: (id: number | string) => `/transactions/${id}`, // put update
    remove: (id: number | string) => `/transactions/${id}`, // DELETE transaction
  },
  category: {
    all: "/finance/categories", // GET all categories (with optional filters)
    getOne: (id: number | string) => `/finance/categories/${id}`, // GET single category
    create: "/finance/categories", // POST create category
    update: (id: number | string) => `/finance/categories/${id}`, // PATCH update category
    remove: (id: number | string) => `/finance/categories/${id}`, // DELETE category
    stats: "/finance/categories/stats/all", // GET category stats
  },
  accounts: {
    create: "/finance/accounts", // POST create new account
    my: "/finance/accounts/my", // GET accounts for current user
    access: "/finance/accounts/access", // GET accounts with roles for current user
    update: (id: number | string) => `/finance/accounts/${id}`, // PUT update account
    remove: (id: number | string) => `/finance/accounts/${id}`, // DELETE account
    getOne: (id: number | string) => `/finance/accounts/${id}`, // GET single account
    types: {
      all: "/finance/accounts/types/all", // GET all active account types
    },
    roles: {
      assign: (id: number | string) => `/finance/accounts/${id}/roles`, // POST assign role to user
      list: (id: number | string) => `/finance/accounts/${id}/roles`, // GET roles assigned to account
      update: (id: number | string, userId: number | string) =>
        `/finance/accounts/${id}/roles/${userId}`, // PUT update user role for account
      remove: (id: number | string, userId: number | string) =>
        `/finance/accounts/${id}/roles/${userId}`, // DELETE remove user role from account
    },
  },
  user: {
    profile: "/profile",
    updateProfile: "/profile",
    updatePreference: "/profile/preference",
  },
  securityQuestions: {
    get: "/security-questions",
    create: "/security-questions",
    update: (id: number | string) => `/security-questions/${id}`,
    delete: (id: number | string) => `/security-questions/${id}`,
  },
  currency: {
    get: "/finance/currencies",
  },
  roles: {
    getAll: "/roles",
    getOne: (id: number | string) => `/roles/${id}`,
  },
};
