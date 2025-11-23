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
  const refreshAll = async (accountId: number) => {
    if (!accountId || !userStore.user?.id) return;

    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    const month = parseInt(format(today, "MM"), 10);
    const year = parseInt(format(today, "yyyy"), 10);

    const query: FindTransactionsDto = {
      creatorUserId: userStore.user?.id,
      page: 1,
      pageSize: 5,
      sortBy: "updatedAt",
      sortOrder: "DESC",
      to: todayStr,
    };

    await Promise.all([
      accountStore.getAccount(accountId),
      summaryStore.getTransactionDashboardComparison(accountId),
      summaryStore.getDailyCategorySummary(accountId, { date: todayStr }),
      summaryStore.getMonthlyCategorySummary(accountId, { month, year }),
      transactionStore.getAllTransactions(accountId, query),
      accountStore.getAccountsWithAccess(),
    ]);
  };

  return { refreshAll };
};
