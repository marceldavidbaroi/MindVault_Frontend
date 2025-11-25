"use client";

import React, { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar"; // ✅ NOT lucide-react
import { Button } from "@/components/ui/button"; // ✅ Correct shadCN button
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export const TransactionExplorerFilter: React.FC = () => {
  const categoryStore = useCategoryStore();
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();
  const { refreshTransactions } = useTransactionRefresh();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];
  const [collapsed, setCollapsed] = useState(true); // ← new state

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

  const filteredCategories = !transactionStore.filters?.type
    ? categoryStore.categories
    : categoryStore.categories.filter(
        (c) => c.type === transactionStore.filters?.type
      );

  return (
    <div className="bg-background rounded-sm shadow-sm p-3">
      {/* Collapse/Expand Button */}
      {/* Collapse / Expand Header */}
      {!collapsed ? (
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">Filters</h2>

            {accountStore.selectedAccount?.balance !== null && (
              <span className="text-sm text-muted-foreground font-normal">
                Balance: {accountStore.selectedAccount?.balance}{" "}
                {accountStore.selectedAccount?.currency?.code}
              </span>
            )}
          </div>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 text-sm border rounded hover:bg-accent"
            onClick={() => setCollapsed(true)}
          >
            <ChevronUp size={16} />
            Hide
          </button>
        </div>
      ) : (
        <div className="mb-2 flex justify-between">
          {accountStore.selectedAccount?.balance !== null && (
            <span className="text-base font-bold">
              Balance: {accountStore.selectedAccount?.balance}{" "}
              {accountStore.selectedAccount?.currency?.code}
            </span>
          )}
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1 text-sm border rounded-full hover:bg-accent"
            onClick={() => setCollapsed(false)}
          >
            <Filter size={16} />
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                if (newId)
                  router.push(`/finance/transaction-explorer/${newId}`);
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {transactionStore.filters?.from
                        ? format(new Date(transactionStore.filters.from), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]">
                    <Calendar
                      mode="single"
                      selected={
                        transactionStore.filters?.from
                          ? new Date(transactionStore.filters.from)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date)
                          updateFilters({ from: format(date, "yyyy-MM-dd") });
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="flex flex-col">
                <Label>To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {transactionStore.filters?.to
                        ? format(new Date(transactionStore.filters.to), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]">
                    <Calendar
                      mode="single"
                      selected={
                        transactionStore.filters?.to
                          ? new Date(transactionStore.filters.to)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date)
                          updateFilters({ to: format(date, "yyyy-MM-dd") });
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
      )}
    </div>
  );
};

export default TransactionExplorerFilter;
