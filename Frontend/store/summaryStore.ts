import { create } from "zustand";
import { summaryService } from "@/services/summaryService";
import { TransactionSummaryDashboard } from "@/types/Summary.type";

interface SummaryState {
  transactionsDashboard: TransactionSummaryDashboard;
  setTransactionDashboard: (
    transactionsDashboard: TransactionSummaryDashboard
  ) => void;
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
