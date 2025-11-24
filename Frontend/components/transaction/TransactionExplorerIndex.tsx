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

const TransactionExplorerIndex = () => {
  const transactionStore = useTransactionStore();
  const accountStore = useAccountStore();
  const { refreshTransactions } = useTransactionRefresh();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CreateTransactionDto | undefined>();

  const selectedAccountId = accountStore.selectedAccountId;

  // -------------------------
  // Fetch transactions
  // -------------------------
  const fetchTransactions = async (customFilters?: FindTransactionsDto) => {
    if (!selectedAccountId) return;

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

    // Fetch transactions
    Promise.all([await refreshTransactions(Number(selectedAccountId), query)]);
  };

  // -------------------------
  // Init on account change
  // -------------------------
  useEffect(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");

    fetchTransactions({
      page: 1,
      pageSize: 5,
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

      {/* List */}
      <TransactionExplorerList />

      {/* Pagination */}
      <Pagination
        total={transactionStore.meta?.total ?? 0}
        page={transactionStore.filters.page ?? 1}
        pageSize={transactionStore.filters.pageSize ?? 25}
        onPageChange={(newPage) => {
          fetchTransactions({ page: newPage });
        }}
        onPageSizeChange={(newSize) => {
          fetchTransactions({ page: 1, pageSize: newSize }); // reset to page 1 when size changes
        }}
      />

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
