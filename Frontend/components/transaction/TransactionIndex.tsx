"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "./AccountList";
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
import { BulkTransactionDialog } from "./BulkTransactionFormModal";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";

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
  const { refreshAll } = useTransactionRefresh();

  const [initialLoading, setInitialLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CreateTransactionDto | undefined>(
    undefined
  );

  useEffect(() => {
    accountStore.setSelectedAccountId(selectedAccountId);
  }, [selectedAccountId]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      if (accountStore.selectedAccountId) {
        console.log("this is hut", selectedAccountId);

        setInitialLoading(true);

        // Load static data

        await Promise.all([
          accountStore.getAccountsWithAccess(),
          categoryStore.getAllCategories(),
          currencyStore.getAllCurrencies(),
        ]);
        // accountStore.setSelectedAccountId(selectedAccountId);

        await refreshAll(Number(selectedAccountId)); // use composable for initial fetch

        setInitialLoading(false);
      }
    };

    loadData();
  }, [accountStore.selectedAccountId]);

  // Open create dialog
  const handleAddTransaction = () => {
    setEditData(undefined);
    setDialogOpen(true);
  };

  const handleBulkTransaction = () => setBulkDialogOpen(true);
  const handleExplorer = () => console.log("Explorer clicked");

  return (
    <div className="h-full grid grid-cols-12 gap-3 p-3">
      {/* LEFT SIDEBAR */}
      <div className="col-span-2 h-full rounded-xl flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
        {initialLoading ? <AccountsListSkeleton /> : <AccountsList />}
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-10 grid grid-rows-[5%_25%_70%] gap-3">
        {/* BUTTONS */}
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

        {/* TOP SECTION */}
        <div className="rounded-xl backdrop-blur-md overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {initialLoading ? (
              <DashboardSummaryRowSkeleton />
            ) : (
              <DashboardSummaryRow />
            )}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-10 gap-3">
          <div className="col-span-10 md:col-span-5 rounded-xl backdrop-blur-md">
            {initialLoading ? (
              <CompactTransactionListSkeleton />
            ) : (
              <CompactTransactionList />
            )}
          </div>

          <div className="col-span-10 md:col-span-5 rounded-xl backdrop-blur-md">
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

      <BulkTransactionDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
      />
    </div>
  );
};

export default TransactionIndex;
