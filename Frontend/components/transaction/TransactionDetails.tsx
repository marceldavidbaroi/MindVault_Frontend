"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { TransactionDialog } from "./TransactionFormModal";
import { useTransactionStore } from "@/store/transactionStore";
import { useAccountStore } from "@/store/accountStore";
import { useRouter } from "next/navigation";

export default function TransactionDetails({ data }: { data: any }) {
  const transactionStore = useTransactionStore();
  const accountStore = useAccountStore();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [transaction, setTransaction] = useState(data); // hold updated data

  // -------------------------------------------------------
  // 🔹 Convert API response → CreateTransactionDto format
  // -------------------------------------------------------
  const editData = {
    id: transaction.id,
    accountId: transaction.account.id,
    categoryId: transaction.category.id,
    type: transaction.type,
    amount: transaction.amount,
    currencyCode: transaction.currency.code,
    transactionDate: transaction.transactionDate,
    description: transaction.description ?? "",
    status: transaction.status,
    externalRefId: transaction.externalRefId ?? "",
    recurring: transaction.recurring,
    recurringInterval: transaction.recurringInterval,
  };

  // -------------------------------------------------------
  // 🔹 Delete handler
  // -------------------------------------------------------
  const handleDelete = async () => {
    try {
      await transactionStore.deleteTransaction(transaction.id);
      setShowDelete(false);

      // Redirect after deletion
      const selectedAccountId = accountStore.selectedAccountId;
      if (selectedAccountId) {
        router.push(`/finance/transaction-explorer/${selectedAccountId}`);
      } else {
        router.push(`/finance/transaction-explorer`);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // -------------------------------------------------------
  // 🔹 After editing → refetch the updated transaction
  // -------------------------------------------------------
  const handleEditClose = async () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 p-3">
      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-md rounded-xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Transaction Details
            </h2>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-8 px-3 rounded-lg text-sm"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => setShowDelete(true)}
                className="h-8 px-3 rounded-lg text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CompactItem
              label="Amount"
              value={`${transaction.currency.symbol}${transaction.amount}`}
            />
            <CompactItem label="Type" value={transaction.type} />

            <CompactItem label="Status" value={transaction.status} />
            <CompactItem label="Date" value={transaction.transactionDate} />

            <CompactItem
              label="Category"
              value={transaction.category.displayName}
            />
            <CompactItem label="Currency" value={transaction.currency.code} />

            <CompactItem
              label="Recurring"
              value={transaction.recurring ? "Yes" : "No"}
            />
            <CompactItem
              label="Interval"
              value={transaction.recurringInterval}
            />

            <CompactItem label="Account" value={transaction.account.name} />
            <CompactItem
              label="Created By"
              value={transaction.creatorUser.username}
            />

            <CompactItem label="Created At" value={transaction.createdAt} />
            <CompactItem label="Updated At" value={transaction.updatedAt} />

            <CompactItem
              label="Description"
              value={transaction.description ?? "No description"}
              className="sm:col-span-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Transaction Edit Dialog */}
      {isEditing && (
        <TransactionDialog
          open={isEditing}
          onClose={handleEditClose}
          initialData={editData}
        />
      )}

      {/* 🔹 DELETE CONFIRMATION — NO GLASS EFFECT */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="bg-white rounded-xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Delete this transaction?
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mt-2">
            Are you sure? This action cannot be undone.
          </p>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const CompactItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: any;
  className?: string;
}) => (
  <div
    className={`p-3 rounded-lg bg-white/5 border border-white/10 text-sm ${className}`}
  >
    <p className="text-xs opacity-60 leading-none mb-1">{label}</p>
    <p className="font-medium leading-tight">{value}</p>
  </div>
);
