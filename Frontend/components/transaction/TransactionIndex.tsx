"use client";

import React, { useEffect, useRef, useState } from "react";
import AccountsList from "./AccountList";
import { useAccountStore } from "@/store/accountStore";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Compass } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { TransactionDialog } from "./TransactionFormModal";
import { CreateTransactionDto } from "@/types/Transaction.type";
import DashboardSummaryRow from "./DashboardSummaryRow";
import { useSummaryStore } from "@/store/summaryStore";
import CompactTransactionList from "./CompactTransactionList";
import CategorySummaryChart from "./CategorySummaryBarChart";
import CategorySummaryChartSkeleton from "./skeleton/Category Summary Bar ChartSkeleton";
import CompactTransactionListSkeleton from "./skeleton/CompactTransactionListSkeleton";
import DashboardSummaryRowSkeleton from "./skeleton/DashboardSummaryRowSkeleton";
import AccountsListSkeleton from "./skeleton/AccountsListSkeleton";
import { BulkTransactionDialog } from "./BulkTransactionFormModal";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";
import { useRouter } from "next/navigation";
import { useAccountRole } from "@/composables/finance/accounts/useAccountRole";

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
  const router = useRouter();
  const { getPermissions } = useAccountRole();
  const { refreshAll } = useTransactionRefresh();

  const [initialLoading, setInitialLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CreateTransactionDto | undefined>();
  const [permissions, setPermissions] = useState({
    isOwner: false,
    isOwnerOrAdmin: false,
    canEdit: false,
  });

  // Set selected account safely
  useEffect(() => {
    if (
      selectedAccountId &&
      selectedAccountId !== accountStore.selectedAccountId
    ) {
      accountStore.setSelectedAccountId(selectedAccountId);
    }
  }, [selectedAccountId]);

  // Prevent double-run from hydration
  const hasLoadedRef = useRef(false);
  const prevAccountIdRef = useRef<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const currentId = accountStore.selectedAccountId;

      if (!currentId) return;

      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
      } else {
        if (prevAccountIdRef.current === currentId) return;
      }

      prevAccountIdRef.current = currentId;

      try {
        setInitialLoading(true);

        const perms = await getPermissions(Number(currentId));
        setPermissions(perms);

        await Promise.all([
          accountStore.getAccountsWithAccess(),
          categoryStore.getAllCategories(),
          currencyStore.getAllCurrencies(),
        ]);

        await refreshAll(Number(currentId));
      } catch (err) {
        // handle error silently
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [accountStore.selectedAccountId]);

  const handleAddTransaction = () => {
    setEditData(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="h-full grid grid-cols-12 gap-3 p-3">
      {/* LEFT SIDEBAR */}
      <div className="col-span-2 h-full rounded-xl flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent">
        {initialLoading ? <AccountsListSkeleton /> : <AccountsList />}
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-10">
        {!initialLoading && !accountStore.selectedAccount ? (
          <div className="h-full flex items-center justify-center p-10">
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold text-red-500">
                Account not found or you do not have access to this account.
              </p>
              <p className="text-muted-foreground">
                Please select a different account from the menu.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-rows-[5%_25%_70%] gap-3 h-full">
            {/* BUTTONS */}
            <div className="flex justify-end gap-1">
              {permissions.canEdit && (
                <>
                  <Button
                    className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-110"
                    onClick={handleAddTransaction}
                  >
                    <Plus size={16} />
                  </Button>

                  <Button
                    className="flex items-center gap-2 bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:brightness-110"
                    onClick={() => setBulkDialogOpen(true)}
                  >
                    <Layers size={16} />
                  </Button>

                  <Button
                    className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:brightness-110"
                    onClick={() => {
                      if (accountStore.selectedAccountId) {
                        router.push(
                          `/finance/transaction-explorer/${accountStore.selectedAccountId}`
                        );
                      }
                    }}
                  >
                    <Compass size={16} />
                  </Button>
                </>
              )}
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
        )}
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
