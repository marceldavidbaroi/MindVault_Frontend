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
  setTransactionDashboardComparison: (
    tdComparison: DashboardComparison
  ) => void;
  setDailyCategorySummary: (
    dailyCategorySummary: CategorySummaryItem[]
  ) => void;
  setMonthlyCategorySummary: (
    monthlyCategorySummary: CategorySummaryItem[]
  ) => void;
  getTransactionDashboardComparison: (id: number) => Promise<void>;
  getDailyCategorySummary: (
    accountId: number,
    query: DailyCategorySummaryDto
  ) => Promise<void>;
  getMonthlyCategorySummary: (
    accountId: number,
    query: MonthlyCategorySummaryDto
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

  setTransactionDashboardComparison: (tdComparison) => set({ tdComparison }),

  setDailyCategorySummary: (dailyCategorySummary) =>
    set({ dailyCategorySummary }),

  setMonthlyCategorySummary: (monthlyCategorySummary) =>
    set({ monthlyCategorySummary }),

  getTransactionDashboardComparison: async (id: number) => {
    try {
      const res = await summaryService.transaction_dashboard_comparison(id);
      if (res.success) set({ tdComparison: res.data });
    } catch (err) {
      console.error("Failed to fetch transaction dashboard:", err);
    }
  },

  getDailyCategorySummary: async (
    accountId: number,
    query: DailyCategorySummaryDto
  ) => {
    try {
      const res = await summaryService.dailyCategorySummary(accountId, query);
      if (res.success) set({ dailyCategorySummary: res.data });
    } catch (err) {
      console.error("Failed to fetch daily category summary:", err);
    }
  },

  getMonthlyCategorySummary: async (
    accountId: number,
    query: MonthlyCategorySummaryDto
  ) => {
    try {
      const res = await summaryService.monthlyCategorySummary(accountId, query);
      if (res.success) set({ monthlyCategorySummary: res.data });
    } catch (err) {
      console.error("Failed to fetch monthly category summary:", err);
    }
  },
}));
