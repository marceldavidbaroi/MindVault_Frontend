"use client";

import React, { useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";
import { useAccountStore } from "@/store/accountStore";
import { FindTransactionsDto, TransactionType } from "@/types/Transaction.type";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";
import { useTransactionStore } from "@/store/transactionStore";

export const TransactionExplorerFilter: React.FC = () => {
  const categoryStore = useCategoryStore();
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();
  const { refreshTransactions } = useTransactionRefresh();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  // Load categories and accounts on mount
  useEffect(() => {
    categoryStore.getAllCategories();
    accountStore.getAccountsWithAccess();
  }, []);

  // Refactored: handle batch updates
  const updateFilters = async (updates: Partial<FindTransactionsDto>) => {
    const updatedFilters: FindTransactionsDto = {
      ...transactionStore.filters,
      ...updates,
    };
    transactionStore.setFilters(updatedFilters);

    if (accountStore.selectedAccountId) {
      const query: FindTransactionsDto = Object.fromEntries(
        Object.entries(updatedFilters).filter(
          ([, v]) => v !== undefined && v !== null && v !== ""
        )
      ) as FindTransactionsDto;

      await refreshTransactions(Number(accountStore.selectedAccountId), query);
    }
  };

  // Filter categories based on current type in store
  const filteredCategories = !transactionStore.filters?.type
    ? categoryStore.categories
    : categoryStore.categories.filter(
        (c) => c.type === transactionStore.filters?.type
      );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-background rounded-xl shadow-sm">
      {/* ACCOUNT SELECTOR */}
      <div className="flex flex-col">
        <Label>Account</Label>
        <Select
          value={
            accountStore.selectedAccountId !== undefined
              ? accountStore.selectedAccountId?.toString()
              : "all"
          }
          onValueChange={(val) => {
            const newId = val === "all" ? undefined : Number(val);
            accountStore.setSelectedAccountId(Number(newId));
            if (newId) router.push(`/finance/transaction-explorer/${newId}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {accountStore.accessAccounts.map((acc) => (
              <SelectItem key={acc.id} value={acc.account.id.toString()}>
                {acc.account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {accountStore.selectedAccountId && (
        <>
          {/* Category */}
          <div className="flex flex-col">
            <Label>Category</Label>
            <Select
              value={
                transactionStore.filters?.categoryId !== undefined
                  ? transactionStore.filters.categoryId.toString()
                  : "all"
              }
              onValueChange={(val) =>
                updateFilters({
                  categoryId: val === "all" ? undefined : Number(val),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="flex flex-col">
            <Label>Type</Label>
            <Select
              value={transactionStore.filters?.type ?? "all"}
              onValueChange={(val) => {
                const typeValue = (val === "all" ? undefined : val) as
                  | TransactionType
                  | undefined;
                // Batch update: reset category and set type together
                updateFilters({ categoryId: undefined, type: typeValue });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <Label>Status</Label>
            <Select
              value={transactionStore.filters?.status ?? "all"}
              onValueChange={(val) =>
                updateFilters({
                  status: (val === "all" ? undefined : val) as
                    | "pending"
                    | "cleared"
                    | "void"
                    | "failed"
                    | undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="void">Void</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Creator */}
          <div className="flex flex-col">
            <Label>Creator</Label>
            <Select
              value={
                transactionStore.filters?.creatorUserId !== undefined
                  ? transactionStore.filters.creatorUserId.toString()
                  : "all"
              }
              onValueChange={(val) =>
                updateFilters({
                  creatorUserId: val === "all" ? undefined : Number(val),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {(
                  accountStore.accountRoles[
                    Number(accountStore.selectedAccountId)
                  ] ?? []
                ).map((role) => (
                  <SelectItem key={role.id} value={role.user.id.toString()}>
                    {role.user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="flex flex-col">
            <Label>From</Label>
            <Input
              type="date"
              value={transactionStore.filters?.from || ""}
              onChange={(e) => updateFilters({ from: e.target.value })}
            />
          </div>

          {/* Date To */}
          <div className="flex flex-col">
            <Label>To</Label>
            <Input
              type="date"
              value={transactionStore.filters?.to || today}
              onChange={(e) => updateFilters({ to: e.target.value })}
            />
          </div>

          {/* Sort By */}
          <div className="flex flex-col">
            <Label>Sort By</Label>
            <Select
              value={transactionStore.filters?.sortBy ?? "updatedAt"}
              onValueChange={(val) =>
                updateFilters({
                  sortBy: val as
                    | "updatedAt"
                    | "transactionDate"
                    | "amount"
                    | "type"
                    | "status"
                    | "externalRefId"
                    | "id"
                    | "createdAt"
                    | undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Updated At" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactionDate">
                  Transaction Date
                </SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="externalRefId">External Ref</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="createdAt">Created At</SelectItem>
                <SelectItem value="updatedAt">Updated At</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="flex flex-col">
            <Label>Sort Order</Label>
            <Select
              value={transactionStore.filters?.sortOrder ?? "DESC"}
              onValueChange={(val) =>
                updateFilters({
                  sortOrder: (val as "ASC" | "DESC") ?? undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="DESC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Ascending</SelectItem>
                <SelectItem value="DESC">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionExplorerFilter;
