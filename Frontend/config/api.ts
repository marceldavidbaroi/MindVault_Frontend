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
    // Combined summaries
    dashboard_comparison: (accountId: number | string) =>
      `/summaries/${accountId}/comparison`,
    dailyCategorySummary: (accountId: number) =>
      `/category-summaries/${accountId}/daily`,
    monthlyCategorySummary: (accountId: number) =>
      `/category-summaries/${accountId}/monthly`,
    dailySummary: {
      get: (accountId: number) => `/daily-summaries/${accountId}`,
      comparison: (accountId: number) =>
        `/daily-summaries/${accountId}/comparison`,
      lastNDays: (accountId: number) =>
        `/daily-summaries/${accountId}/last-n-days`,
    },
    weeklySummary: {
      get: (accountId: number) => `/weekly-summaries/${accountId}`,
      comparison: (accountId: number) =>
        `/weekly-summaries/${accountId}/comparison`,
      lastNWeeks: (accountId: number) =>
        `/weekly-summaries/${accountId}/last-n-weeks`,
    },
    monthlySummary: {
      get: (accountId: number) => `/monthly-summaries/${accountId}`,
      comparison: (accountId: number) =>
        `/monthly-summaries/${accountId}/comparison`,
      lastNMonths: (accountId: number) =>
        `/monthly-summaries/${accountId}/last-n-months`,
    },
    yearlySummary: {
      get: (accountId: number) => `/yearly-summaries/${accountId}`,
      comparison: (accountId: number) =>
        `/yearly-summaries/${accountId}/comparison`,
      lastNYears: (accountId: number) =>
        `/yearly-summaries/${accountId}/last-n-years`,
    },
    trendInsights: {
      trend: (accountId: number) => `/trend-insights/${accountId}/trend`,
      topCategories: (accountId: number) =>
        `/trend-insights/${accountId}/top-categories`,
    },
  },
  transaction: {
    getAll: (accountId: number) => `/transactions/${accountId}/transactions`,
    getOne: (id: number | string) => `/transactions/${id}`,
    create: "/transactions",
    createBulk: "/transactions/bulk",
    update: (id: number | string) => `/transactions/${id}`,
    remove: (id: number | string) => `/transactions/${id}`,
  },
  category: {
    all: "/finance/categories",
    getOne: (id: number | string) => `/finance/categories/${id}`,
    create: "/finance/categories",
    update: (id: number | string) => `/finance/categories/${id}`,
    remove: (id: number | string) => `/finance/categories/${id}`,
    stats: "/finance/categories/stats/all",
  },
  accounts: {
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
      assign: (id: number | string) => `/finance/accounts/${id}/roles`,
      list: (id: number | string) => `/finance/accounts/${id}/roles`,
      update: (id: number | string, userId: number | string) =>
        `/finance/accounts/${id}/roles/${userId}`,
      remove: (id: number | string, userId: number | string) =>
        `/finance/accounts/${id}/roles/${userId}`,
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
