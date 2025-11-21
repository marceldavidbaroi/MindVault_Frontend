"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useTransactionStore } from "@/store/transactionStore";
import { TransactionDialog } from "@/components/transaction/TransactionFormModal";
import {
  CreateTransactionDto,
  FindTransactionsDto,
} from "@/types/Transaction.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { format } from "date-fns";
import { useUserStore } from "@/store/userStore";

export default function CompactTransactionList() {
  const transactionStore = useTransactionStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<CreateTransactionDto | undefined>();
  const accountStore = useAccountStore();
  const summaryStore = useSummaryStore();
  const userStore = useUserStore();

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleEdit = async (id: number) => {
    const res = await transactionStore.getTransaction(id);
    if (res) {
      const tx = res;
      const dto: CreateTransactionDto = {
        id: tx.id,
        accountId: tx.account.id,
        categoryId: tx.category?.id,
        currencyCode: tx.currency?.code,
        type: tx.type,
        amount: tx.amount,
        transactionDate: tx.transactionDate,
        description: tx.description ?? undefined,
        status: tx.status,
        recurring: tx.recurring,
        recurringInterval: tx.recurringInterval,
        externalRefId: tx.externalRefId ?? undefined,
      };

      setEditData(dto);
      setDialogOpen(true);
    }
  };

  const handleDeleteConfirm = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoadingDelete(true);

      // Delete the transaction
      await transactionStore.deleteTransaction(deleteId);

      // Refetch all related APIs (like create/update does)
      if (accountStore.selectedAccountId != null) {
        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");
        const month = parseInt(format(today, "MM"), 10);
        const year = parseInt(format(today, "yyyy"), 10);

        const query: FindTransactionsDto = {
          creatorUserId: userStore.user?.id,
          to: todayStr,
          page: 1,
          pageSize: 5,
          sortBy: "updatedAt",
          sortOrder: "DESC",
        };

        await Promise.all([
          accountStore.getAccount(Number(accountStore.selectedAccountId)),
          summaryStore.getTransactionDashboardComparison(
            Number(accountStore.selectedAccountId)
          ),
          summaryStore.getDailyCategorySummary(
            Number(accountStore.selectedAccountId),
            { date: todayStr }
          ),
          summaryStore.getMonthlyCategorySummary(
            Number(accountStore.selectedAccountId),
            { month, year }
          ),
          transactionStore.getAllTransactions(
            Number(accountStore.selectedAccountId),
            query
          ),
          accountStore.getAccountsWithAccess(),
        ]);
      }

      setDeleteDialogOpen(false);
      setDeleteId(null);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="w-full h-full p-3 space-y-2 backdrop-blur-md bg-background/60 rounded-xl border border-white/20 shadow-md">
      {transactionStore.transactions?.items.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 rounded-lg bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 transition"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-sm capitalize">{tx.type}</span>
            <span className="text-xs opacity-70">{tx.transactionDate}</span>
            <span className="text-xs">{tx.category?.name}</span>
          </div>

          <div className="text-right">
            <span
              className={`font-bold text-sm ${
                tx.type === "income" ? "" : "text-primary"
              }`}
            >
              {tx.currency?.symbol} {tx.amount}
            </span>
            <div className="text-xs opacity-60 capitalize">{tx.status}</div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/20"
              onClick={() => handleEdit(tx.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/20"
              onClick={() => handleDeleteConfirm(tx.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Transaction Form Modal */}
      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editData}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this transaction?
          </p>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
