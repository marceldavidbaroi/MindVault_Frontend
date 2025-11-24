"use client";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";
import { FindTransactionsDto } from "@/types/Transaction.type";
import { format } from "date-fns";
import React, { useEffect } from "react";
import TransactionExplorerList from "./TransactionExplorerList";
import TransactionExplorerFilter from "./TransactionExplorerFilter";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";
import Pagination from "../common/Pagination";

const TransactionExplorerIndex = () => {
  const transactionStore = useTransactionStore();
  const accountStore = useAccountStore();
  const { refreshTransactions } = useTransactionRefresh();

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
    await refreshTransactions(Number(selectedAccountId), query);
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <TransactionExplorerFilter />

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
    </div>
  );
};

export default TransactionExplorerIndex;
