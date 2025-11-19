"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "./AccountList";
import { AccessAccount } from "@/types/Account.type";
import { useAccountStore } from "@/store/accountStore";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Compass } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { TransactionDialog } from "./TransactionFormModal";
import {
  CreateTransactionDto,
  FindTransactionsDto,
} from "@/types/Transaction.type";
import DashboardSummaryRow from "./DashboardSummaryRow";
import { useSummaryStore } from "@/store/summaryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useUserStore } from "@/store/userStore";
import { format } from "date-fns";
import CompactTransactionList from "./CompactTransactionList";
import CategorySummaryChart from "./CategorySummaryBarChart";
import CategorySummaryChartSkeleton from "./skeleton/Category Summary Bar ChartSkeleton";
import CompactTransactionListSkeleton from "./skeleton/CompactTransactionListSkeleton";
import DashboardSummaryRowSkeleton from "./skeleton/DashboardSummaryRowSkeleton";
import AccountsListSkeleton from "./skeleton/AccountsListSkeleton";

interface TransactionIndexProps {
  selectedAccountId: string | number | null;
}

const TransactionIndex: React.FC<TransactionIndexProps> = ({
  selectedAccountId,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();
  const summaryStore = useSummaryStore();
  const transactionStore = useTransactionStore();
  const userStore = useUserStore();

  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      // Only fetch static data once
      await Promise.all([
        accountStore.getAccountsWithAccess(),
        categoryStore.getAllCategories(),
        currencyStore.getAllCurrencies(),
      ]);
      const today = new Date();

      // Fetch the selected account & dashboard summary only if ID exists
      if (selectedAccountId != null) {
        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");
        const month = parseInt(format(today, "MM"), 10);
        const year = parseInt(format(today, "yyyy"), 10);

        accountStore.setSelectedAccountId(selectedAccountId);

        const query: FindTransactionsDto = {
          creatorUserId: userStore.user?.id,
          from: todayStr,
          to: todayStr,
          page: 1,
          pageSize: 5,
          sortBy: "updatedAt",
          sortOrder: "DESC",
        };

        // 🔥 Run all requests in parallel
        await Promise.all([
          accountStore.getAccount(Number(selectedAccountId)),
          summaryStore.getTransactionDashboardComparison(
            Number(selectedAccountId)
          ),
          summaryStore.getDailyCategorySummary(Number(selectedAccountId), {
            date: todayStr,
          }),
          summaryStore.getMonthlyCategorySummary(Number(selectedAccountId), {
            month,
            year,
          }),
          transactionStore.getAllTransactions(Number(selectedAccountId), query),
        ]);
      }
      setInitialLoading(false);
    };

    loadData();
  }, [selectedAccountId]);

  const [dialogOpen, setDialogOpen] = useState(false);

  // For edit mode (null = create mode)
  const [editData, setEditData] = useState<CreateTransactionDto | undefined>(
    undefined
  );

  // open create dialog
  const handleAddTransaction = () => {
    setEditData(undefined);
    setDialogOpen(true);
  };

  const handleBulkTransaction = () => console.log("Bulk Transaction clicked");
  const handleExplorer = () => console.log("Explorer clicked");

  return (
    <div className="h-full grid grid-cols-12 gap-3 p-3">
      {/* LEFT SIDEBAR - GLASS */}
      <div
        className="
          col-span-2 h-full
          rounded-xl
          flex flex-col
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent
        "
      >
        {initialLoading ? <AccountsListSkeleton /> : <AccountsList />}
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-10 grid grid-rows-[5%_25%_70%] gap-3">
        {/* BUTTONS ROW - RIGHT ALIGNED */}
        <div className="flex justify-end gap-1">
          <Button
            className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-110"
            onClick={handleAddTransaction}
          >
            <Plus size={16} />
          </Button>

          <Button
            className="flex items-center gap-2 bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:brightness-110"
            onClick={handleBulkTransaction}
          >
            <Layers size={16} />
          </Button>

          <Button
            className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:brightness-110"
            onClick={handleExplorer}
          >
            <Compass size={16} />
          </Button>
        </div>

        {/* TOP SECTION - GLASS */}
        <div
          className="
    rounded-xl
    backdrop-blur-md
    overflow-x-auto
  "
        >
          <div className="flex gap-4 min-w-max">
            {initialLoading ? (
              <DashboardSummaryRowSkeleton />
            ) : (
              <DashboardSummaryRow />
            )}
          </div>
        </div>

        {/* BOTTOM SECTION (split 5 + 5) */}
        <div className="grid grid-cols-10 gap-3">
          <div
            className="
      col-span-10
      md:col-span-5
      rounded-xl
      backdrop-blur-md
    "
          >
            {initialLoading ? (
              <CompactTransactionListSkeleton />
            ) : (
              <CompactTransactionList />
            )}
          </div>

          <div
            className="
      col-span-10
      md:col-span-5
      rounded-xl
      backdrop-blur-md
    "
          >
            {initialLoading ? (
              <CategorySummaryChartSkeleton />
            ) : (
              <CategorySummaryChart />
            )}
          </div>
        </div>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editData}
      />
    </div>
  );
};

export default TransactionIndex;
