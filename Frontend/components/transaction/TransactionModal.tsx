"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreateTransactionDto } from "@/types/Transaction.type";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useSummaryStore } from "@/store/summaryStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker"; // ✅ ShadCN DatePicker
import { toast } from "sonner";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: CreateTransactionDto & { id?: number; category?: any };
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  transaction,
}) => {
  const isEditMode = !!transaction;

  const { categories } = useCategoryStore();
  const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
  } = useTransactionStore();
  const { getTransactionDashboard } = useSummaryStore();

  const [form, setForm] = useState<CreateTransactionDto>({
    type: "expense",
    categoryId: 0,
    amount: undefined as unknown as number,
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurring: false,
    recurringInterval: undefined,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Fill in form for edit mode
  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        categoryId: transaction.category?.id ?? 0,
        amount: Number(transaction.amount),
        date: transaction.date,
        description: transaction.description || "",
        recurring: transaction.recurring || false,
        recurringInterval: transaction.recurringInterval || undefined,
      });
    } else {
      setForm({
        type: "income",
        categoryId: 0,
        amount: undefined as unknown as number,
        date: new Date().toISOString().split("T")[0],
        description: "",
        recurring: false,
        recurringInterval: undefined,
      });
    }
    setErrors({});
  }, [transaction]);

  const handleChange = (key: keyof CreateTransactionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Basic validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.type) newErrors.type = "Type is required";
    if (!form.categoryId || form.categoryId === 0)
      newErrors.categoryId = "Category is required";
    if (!form.amount || form.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!form.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast?.error?.("Please fill in all required fields");
      return;
    }

    if (isEditMode && transaction?.id) {
      await updateTransaction(transaction.id, form);
    } else {
      await createTransaction(form);
    }

    await getAllTransactions();
    await getTransactionDashboard();
    resetForm();

    onClose();
  };

  const confirmDelete = async () => {
    console.log("Confirmed delete for transaction:", transaction?.id);
    await deleteTransaction(transaction?.id);
    await getAllTransactions();
    await getTransactionDashboard();
    setShowDeleteConfirm(false);
    resetForm();

    onClose();
  };

  const resetForm = () => {
    setForm({
      type: "expense",
      categoryId: 0,
      amount: undefined as unknown as number,
      date: new Date().toISOString().split("T")[0],
      description: "",
      recurring: false,
      recurringInterval: undefined,
    });
    setErrors({});
  };

  return (
    <>
      {/* Main Add/Edit Dialog */}
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) {
            onClose();
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md w-full bg-card border border-border rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground font-bold">
              {isEditMode ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
            <DialogDescription className="text-foreground/70">
              {isEditMode
                ? "Update the details for this transaction"
                : "Fill in the details for your new transaction"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Type */}
            <div className="flex flex-col gap-1">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <span className="text-red-500 text-xs">{errors.type}</span>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <Label>Category</Label>
              <Select
                value={form.categoryId ? String(form.categoryId) : ""}
                onValueChange={(val) => handleChange("categoryId", Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories ?? [])
                    .filter((cat) => cat.type === form.type)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.displayName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <span className="text-red-500 text-xs">
                  {errors.categoryId}
                </span>
              )}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
              <Label>Amount</Label>
              <Input
                type="number"
                value={form.amount ?? ""}
                onFocus={(e) => {
                  if (!form.amount) e.target.select();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("amount", val ? Number(val) : undefined);
                }}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <span className="text-red-500 text-xs">{errors.amount}</span>
              )}
            </div>

            {/* Date using ShadCN DatePicker */}
            <div className="flex flex-col gap-1">
              <Label>Date</Label>
              <DatePicker
                selected={form.date ? new Date(form.date) : undefined}
                onSelect={(date) =>
                  handleChange("date", date.toISOString().split("T")[0])
                }
                placeholder="Select date"
              />
              {errors.date && (
                <span className="text-red-500 text-xs">{errors.date}</span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <Label>Description</Label>
              <Input
                type="text"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Optional description"
              />
            </div>

            {/* Recurring */}
            <div className="flex items-center justify-between">
              <Label>Recurring</Label>
              <Switch
                checked={form.recurring}
                onCheckedChange={(val) => handleChange("recurring", val)}
              />
            </div>

            {form.recurring && (
              <div className="flex flex-col gap-1">
                <Label>Recurring Interval</Label>
                <Select
                  value={form.recurringInterval || ""}
                  onValueChange={(val) =>
                    handleChange("recurringInterval", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            {isEditMode ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="mr-auto"
              >
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {isEditMode ? "Save Changes" : "Add Transaction"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionModal;
