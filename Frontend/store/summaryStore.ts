import { create } from "zustand";
import { summaryService } from "@/services/summaryService";
import {
  DashboardComparison,
  DailySummary,
  WeeklySummary,
  MonthlySummary,
  YearlySummary,
  CategorySummaryItem,
  DailyCategorySummaryDto,
  MonthlyCategorySummaryDto,
} from "@/types/Summary.type";

interface SummaryState {
  tdComparison: DashboardComparison;
  dailyCategorySummary: CategorySummaryItem[];
  monthlyCategorySummary: CategorySummaryItem[];

  dailySummary: any;
  dailyComparison: any;
  lastNDays: any;

  weeklySummary: any;
  weeklyComparison: any;
  lastNWeeks: any;

  monthlySummary: any;
  monthlyComparison: any;
  lastNMonths: any;

  yearlySummary: any;
  yearlyComparison: any;
  lastNYears: any;

  trendInsights: any;
  topCategories: any;

  setTransactionDashboardComparison: (
    tdComparison: DashboardComparison
  ) => void;
  setDailyCategorySummary: (
    dailyCategorySummary: CategorySummaryItem[]
  ) => void;
  setMonthlyCategorySummary: (
    monthlyCategorySummary: CategorySummaryItem[]
  ) => void;

  setDailySummary: (data: any) => void;
  setDailyComparison: (data: any) => void;
  setLastNDays: (data: any) => void;

  setWeeklySummary: (data: any) => void;
  setWeeklyComparison: (data: any) => void;
  setLastNWeeks: (data: any) => void;

  setMonthlySummary: (data: any) => void;
  setMonthlyComparison: (data: any) => void;
  setLastNMonths: (data: any) => void;

  setYearlySummary: (data: any) => void;
  setYearlyComparison: (data: any) => void;
  setLastNYears: (data: any) => void;

  setTrendInsights: (data: any) => void;
  setTopCategories: (data: any) => void;

  getTransactionDashboardComparison: (id: number) => Promise<void>;
  getDailyCategorySummary: (
    accountId: number,
    query: DailyCategorySummaryDto
  ) => Promise<void>;
  getMonthlyCategorySummary: (
    accountId: number,
    query: MonthlyCategorySummaryDto
  ) => Promise<void>;

  getDailySummary: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getDailyComparison: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getLastNDays: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;

  getWeeklySummary: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getWeeklyComparison: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getLastNWeeks: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;

  getMonthlySummary: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getMonthlyComparison: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getLastNMonths: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;

  getYearlySummary: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getYearlyComparison: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getLastNYears: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;

  getTrendInsights: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
  getTopCategories: (
    accountId: number,
    params?: Record<string, any>
  ) => Promise<void>;
}

// Default empty objects for initialization
const defaultDaily: DailySummary = {
  id: null,
  date: null,
  totalIncome: "0.00",
  totalExpense: "0.00",
};
const defaultWeekly: WeeklySummary = {
  id: null,
  weekStart: null,
  totalIncome: "0.00",
  totalExpense: "0.00",
};
const defaultMonthly: MonthlySummary = {
  id: null,
  year: null,
  month: null,
  totalIncome: "0.00",
  totalExpense: "0.00",
};
const defaultYearly: YearlySummary = {
  id: null,
  year: null,
  totalIncome: "0.00",
  totalExpense: "0.00",
};

export const useSummaryStore = create<SummaryState>((set) => ({
  tdComparison: {
    daily: { today: defaultDaily, yesterday: defaultDaily },
    weekly: { thisWeek: defaultWeekly, lastWeek: defaultWeekly },
    monthly: { thisMonth: defaultMonthly, lastMonth: defaultMonthly },
    yearly: { thisYear: defaultYearly, lastYear: defaultYearly },
  },
  dailyCategorySummary: [],
  monthlyCategorySummary: [],

  dailySummary: null,
  dailyComparison: null,
  lastNDays: null,

  weeklySummary: null,
  weeklyComparison: null,
  lastNWeeks: null,

  monthlySummary: null,
  monthlyComparison: null,
  lastNMonths: null,

  yearlySummary: null,
  yearlyComparison: null,
  lastNYears: null,

  trendInsights: null,
  topCategories: [],

  setTransactionDashboardComparison: (tdComparison) => set({ tdComparison }),
  setDailyCategorySummary: (dailyCategorySummary) =>
    set({ dailyCategorySummary }),
  setMonthlyCategorySummary: (monthlyCategorySummary) =>
    set({ monthlyCategorySummary }),

  setDailySummary: (data) => set({ dailySummary: data }),
  setDailyComparison: (data) => set({ dailyComparison: data }),
  setLastNDays: (data) => set({ lastNDays: data }),

  setWeeklySummary: (data) => set({ weeklySummary: data }),
  setWeeklyComparison: (data) => set({ weeklyComparison: data }),
  setLastNWeeks: (data) => set({ lastNWeeks: data }),

  setMonthlySummary: (data) => set({ monthlySummary: data }),
  setMonthlyComparison: (data) => set({ monthlyComparison: data }),
  setLastNMonths: (data) => set({ lastNMonths: data }),

  setYearlySummary: (data) => set({ yearlySummary: data }),
  setYearlyComparison: (data) => set({ yearlyComparison: data }),
  setLastNYears: (data) => set({ lastNYears: data }),

  setTrendInsights: (data) => set({ trendInsights: data }),
  setTopCategories: (data) => set({ setTopCategories: data }),

  getTransactionDashboardComparison: async (id: number) => {
    try {
      const res = await summaryService.transaction_dashboard_comparison(id);
      if (res.success) set({ tdComparison: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getDailyCategorySummary: async (accountId, query) => {
    try {
      const res = await summaryService.dailyCategorySummary(accountId, query);
      if (res.success) set({ dailyCategorySummary: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getMonthlyCategorySummary: async (accountId, query) => {
    try {
      const res = await summaryService.monthlyCategorySummary(accountId, query);
      if (res.success) set({ monthlyCategorySummary: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getDailySummary: async (accountId, params) => {
    try {
      const res = await summaryService.dailySummary.get(accountId, params);
      if (res.success) set({ dailySummary: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getDailyComparison: async (accountId, params) => {
    try {
      const res = await summaryService.dailySummary.comparison(
        accountId,
        params
      );
      if (res.success) set({ dailyComparison: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getLastNDays: async (accountId, params) => {
    try {
      const res = await summaryService.dailySummary.lastNDays(
        accountId,
        params
      );
      if (res.success) set({ lastNDays: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getWeeklySummary: async (accountId, params) => {
    try {
      const res = await summaryService.weeklySummary.get(accountId, params);
      if (res.success) set({ weeklySummary: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getWeeklyComparison: async (accountId, params) => {
    try {
      const res = await summaryService.weeklySummary.comparison(
        accountId,
        params
      );
      if (res.success) set({ weeklyComparison: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getLastNWeeks: async (accountId, params) => {
    try {
      const res = await summaryService.weeklySummary.lastNWeeks(
        accountId,
        params
      );
      if (res.success) set({ lastNWeeks: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getMonthlySummary: async (accountId, params) => {
    try {
      const res = await summaryService.monthlySummary.get(accountId, params);
      if (res.success) set({ monthlySummary: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getMonthlyComparison: async (accountId, params) => {
    try {
      const res = await summaryService.monthlySummary.comparison(
        accountId,
        params
      );
      if (res.success) set({ monthlyComparison: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getLastNMonths: async (accountId, params) => {
    try {
      const res = await summaryService.monthlySummary.lastNMonths(
        accountId,
        params
      );
      if (res.success) set({ lastNMonths: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getYearlySummary: async (accountId, params) => {
    try {
      const res = await summaryService.yearlySummary.get(accountId, params);
      if (res.success) set({ yearlySummary: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getYearlyComparison: async (accountId, params) => {
    try {
      const res = await summaryService.yearlySummary.comparison(
        accountId,
        params
      );
      if (res.success) set({ yearlyComparison: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getLastNYears: async (accountId, params) => {
    try {
      const res = await summaryService.yearlySummary.lastNYears(
        accountId,
        params
      );
      if (res.success) set({ lastNYears: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getTrendInsights: async (accountId, params) => {
    try {
      const res = await summaryService.trendInsights.trend(accountId, params);
      if (res.success) set({ trendInsights: res.data });
    } catch (err) {
      console.error(err);
    }
  },
  getTopCategories: async (accountId, params) => {
    try {
      const res = await summaryService.trendInsights.topCategories(
        accountId,
        params
      );
      if (res.success) set({ topCategories: res.data }); // <-- set topCategories separately
    } catch (err) {
      console.error(err);
    }
  },
}));
