import { create } from "zustand";
import { summaryService } from "@/services/summaryService";

export interface SummaryDashboard {
  recentTransactions: any[];
  summary: any[];
  totalRemainingIncomeAllTime: number;
  totalRemainingIncomeThisMonth: number;
  weekly: {
    totalSpending: number;
    breakdown: {
      day: string;
      amount: number;
    }[];
  };
}

interface SummaryState {
  transactionsDashboard: SummaryDashboard;
  setTransactionDashboard: (transactionsDashboard: SummaryDashboard) => void;
  getTransactionDashboard: (req?: any) => Promise<void>;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  // ✅ Initialize with a proper object, not an array
  transactionsDashboard: {
    recentTransactions: [],
    summary: [],
    totalRemainingIncomeAllTime: 0,
    totalRemainingIncomeThisMonth: 0,
    weekly: {
      totalSpending: 0,
      breakdown: [],
    },
  },

  setTransactionDashboard: (transactionsDashboard) =>
    set({ transactionsDashboard }),

  getTransactionDashboard: async (params) => {
    try {
      const res = await summaryService.transaction_dashboard();
      set({ transactionsDashboard: res.data });
    } catch (err) {
      console.error("Failed to fetch transaction dashboard:", err);
    }
  },
}));
