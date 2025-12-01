"use client";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";
import {
  CreateTransactionDto,
  FindTransactionsDto,
} from "@/types/Transaction.type";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import TransactionExplorerList from "./TransactionExplorerList";
import TransactionExplorerFilter from "./TransactionExplorerFilter";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";
import Pagination from "../common/Pagination";
import { Button } from "../ui/button";
import { Compass, Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { TransactionDialog } from "./TransactionFormModal";
import { BulkTransactionDialog } from "./BulkTransactionFormModal";
import TransactionExplorerSkeleton from "./skeleton/TransactionExplorerIndexSkeleton";
import { useAccountRole } from "@/composables/finance/accounts/useAccountRole";

const TransactionExplorerIndex = () => {
  const transactionStore = useTransactionStore();
  const accountStore = useAccountStore();
  const { getPermissions } = useAccountRole();

  const { refreshTransactions } = useTransactionRefresh();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CreateTransactionDto | undefined>();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    isOwner: false,
    isOwnerOrAdmin: false,
    canEdit: false,
  });

  const selectedAccountId = accountStore.selectedAccountId;

  // -------------------------
  // Fetch transactions
  // -------------------------
  const fetchTransactions = async (customFilters?: FindTransactionsDto) => {
    if (!selectedAccountId) return;

    setLoading(true);
    const perms = await getPermissions(Number(accountStore.selectedAccountId));
    setPermissions(perms);
    // Merge store filters with any custom ones
    const filtersToUse: FindTransactionsDto = {
      ...transactionStore.filters,
      ...customFilters,
    };

    // Remove undefined or empty values
    const query: FindTransactionsDto = {};
    Object.entries(filtersToUse).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query[key as keyof FindTransactionsDto] = value;
      }
    });

    // Update store filters
    transactionStore.setFilters(query);

    try {
      await refreshTransactions(Number(selectedAccountId), query);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Init on account change
  // -------------------------
  useEffect(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");

    fetchTransactions({
      page: 1,
      pageSize: 25,
      sortBy: "updatedAt",
      sortOrder: "DESC",
      to: todayStr,
    });
  }, [selectedAccountId]);

  const handleAddTransaction = () => {
    setEditData(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <TransactionExplorerFilter />

      {/* Action Buttons */}
      {permissions.canEdit && (
        <div className="flex justify-end gap-1">
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
                  `/finance/transaction/${accountStore.selectedAccountId}`
                );
              }
            }}
          >
            <Compass size={16} className="cursor-pointer" />{" "}
          </Button>
        </div>
      )}

      {/* List / Skeleton */}
      {loading ? <TransactionExplorerSkeleton /> : <TransactionExplorerList />}

      {/* Pagination */}
      {!loading && (
        <Pagination
          total={transactionStore.meta?.total ?? 0}
          page={transactionStore.filters.page ?? 1}
          pageSize={transactionStore.filters.pageSize ?? 25}
          onPageChange={(newPage) => {
            fetchTransactions({ page: newPage });
          }}
          onPageSizeChange={(newSize) => {
            fetchTransactions({ page: 1, pageSize: newSize });
          }}
        />
      )}

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editData}
        triggerRefreshAll={false}
      />

      <BulkTransactionDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
      />
    </div>
  );
};

export default TransactionExplorerIndex;
