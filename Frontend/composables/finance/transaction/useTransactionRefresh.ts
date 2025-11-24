// composables/useTransactionRefresh.ts
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { format } from "date-fns";
import { FindTransactionsDto } from "@/types/Transaction.type";
import { useUserStore } from "@/store/userStore";

export const useTransactionRefresh = () => {
  const accountStore = useAccountStore();
  const summaryStore = useSummaryStore();
  const transactionStore = useTransactionStore();
  const userStore = useUserStore();

  // Helper: remove undefined, null, or empty string fields
  const cleanQuery = (obj: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ""
      )
    ) as FindTransactionsDto;
  };

  // -----------------------------------------
  // 1️⃣ Full Refresh (Dashboard + Summary + Tx)
  // -----------------------------------------
  const refreshAll = async (accountId: number) => {
    if (!accountId || !userStore.user?.id) return;

    // Fetch account first to ensure access
    let account;
    try {
      account = await accountStore.getAccount(accountId);
    } catch (error: any) {
      console.error("Failed to fetch account:", error);
      return;
    }

    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    const month = parseInt(format(today, "MM"), 10);
    const year = parseInt(format(today, "yyyy"), 10);

    const query: FindTransactionsDto = {
      creatorUserId: userStore.user.id,
      page: 1,
      pageSize: 5,
      sortBy: "updatedAt",
      sortOrder: "DESC",
      to: todayStr,
    };

    await Promise.all([
      summaryStore.getTransactionDashboardComparison(accountId),
      summaryStore.getDailyCategorySummary(accountId, { date: todayStr }),
      summaryStore.getMonthlyCategorySummary(accountId, { month, year }),
      transactionStore.getAllTransactions(accountId, query),
      accountStore.getAccountsWithAccess(),
    ]);
  };

  // -----------------------------------------------------
  // 2️⃣ Only refresh transactions (clean query)
  // -----------------------------------------------------
  const refreshTransactions = async (
    accountId: number,
    customQuery: FindTransactionsDto
  ) => {
    if (!accountId || !userStore.user?.id) return;

    const finalQuery = cleanQuery(customQuery);

    try {
      await transactionStore.getAllTransactions(accountId, finalQuery);
    } catch (err) {
      console.error("Failed to refresh transactions:", err);
    }
  };

  return { refreshAll, refreshTransactions };
};
