export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  auth: {
    signin: "/auth/signin",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  summary: {
    transactionDashboard: "/summary/transaction-dashboard",
  },
  transaction: {
    all: "/transactions", // GET all transactions with filters & pagination
    getOne: (id: number | string) => `/transactions/${id}`, // GET single transaction
    create: "/transactions", // POST create transaction
    createBulk: "/transactions/bulk", // POST bulk create
    update: (id: number | string) => `/transactions/${id}`, // PATCH update
    remove: (id: number | string) => `/transactions/${id}`, // DELETE transaction
  },
  category: {
    all: "/categories", // GET all categories (with optional filters)
    getOne: (id: number | string) => `/categories/${id}`, // GET single category
    create: "/categories", // POST create category
    update: (id: number | string) => `/categories/${id}`, // PATCH update category
    remove: (id: number | string) => `/categories/${id}`, // DELETE category
    stats: "/categories/stats/all", // GET category stats
  },
  user: {
    profile: "/profile",
    updateProfile: "/profile",
    updatePreference: "/profile/preference",
  },
};
