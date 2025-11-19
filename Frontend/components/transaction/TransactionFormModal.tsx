"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAccountStore } from "@/store/accountStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { format } from "date-fns";
import { Calendar28 } from "../ui/date-picker";
import { useTransactionStore } from "@/store/transactionStore";
import { CreateTransactionDto } from "@/types/Transaction.type";

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: CreateTransactionDto;
}

const getDefaultForm = (
  accountCurrency?: string,
  initialData?: CreateTransactionDto
) => ({
  type: "income" as "income" | "expense",
  status: "pending" as "pending" | "cleared" | "void" | "failed",
  recurring: false,
  recurringInterval: "daily" as "daily" | "weekly" | "monthly" | "yearly",
  transactionDate: format(new Date(), "yyyy-MM-dd"),
  currencyCode: accountCurrency,
  ...initialData,
});

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();
  const transactionStore = useTransactionStore();

  const [form, setForm] = useState<Partial<CreateTransactionDto>>(
    getDefaultForm(accountStore.selectedAccount?.currency?.code, initialData)
  );
  const [loading, setLoading] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTransactionDto, string>>
  >({});

  // Reset form and errors when dialog closes or initialData changes
  useEffect(() => {
    if (!open) {
      setForm(
        getDefaultForm(
          accountStore.selectedAccount?.currency?.code,
          initialData
        )
      );
      setErrors({});
    }
  }, [open, initialData, accountStore.selectedAccount?.currency?.code]);

  const handleChange = (key: keyof CreateTransactionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // Clear error for field when changed
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const filteredCategories = categoryStore.categories.filter(
    (c) => c.type === form.type
  );

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateTransactionDto, string>> = {};

    if (!accountStore.selectedAccountId)
      newErrors.accountId = "Account is required.";
    if (!form.type) newErrors.type = "Transaction type is required.";
    if (!form.categoryId) newErrors.categoryId = "Category is required.";
    if (!form.amount || form.amount.trim() === "")
      newErrors.amount = "Amount is required.";
    if (!form.transactionDate)
      newErrors.transactionDate = "Transaction date is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload: CreateTransactionDto = {
        accountId: Number(accountStore.selectedAccountId),
        type: form.type!,
        amount: form.amount!,
        transactionDate: form.transactionDate!,
        categoryId: form.categoryId,
        currencyCode: form.currencyCode,
        description: form.description,
        status: form.status,
        externalRefId: form.externalRefId,
        recurring: form.recurring,
        recurringInterval: form.recurringInterval,
      };

      await transactionStore.createTransaction(payload);

      setForm(getDefaultForm(accountStore.selectedAccount?.currency?.code));
      setErrors({});
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field: keyof CreateTransactionDto) => {
    if (!errors[field]) return null;
    return <p className="text-sm text-red-600 mt-1">{errors[field]}</p>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg max-h-[70vh] overflow-y-auto
             scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-md
             scrollbar-thumb-neutral-400 hover:scrollbar-thumb-neutral-500"
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Transaction" : "Create Transaction"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Account */}
          <div>
            <Label>Account</Label>
            <Select
              value={
                form.accountId
                  ? String(form.accountId)
                  : String(accountStore.selectedAccountId)
              }
              onValueChange={(v) => handleChange("accountId", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accountStore.accessAccounts.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderError("accountId")}
          </div>

          {/* Type */}
          <div>
            <Label>Type</Label>
            <RadioGroup
              value={form.type}
              onValueChange={(v) => handleChange("type", v)}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="type-income" />
                <Label htmlFor="type-income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="type-expense" />
                <Label htmlFor="type-expense">Expense</Label>
              </div>
            </RadioGroup>
            {renderError("type")}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              value={form.categoryId ? String(form.categoryId) : undefined}
              onValueChange={(v) => handleChange("categoryId", Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderError("categoryId")}
          </div>

          {/* Currency */}
          <div>
            <Label>Currency</Label>
            <Select
              value={form.currencyCode}
              onValueChange={(v) => handleChange("currencyCode", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencyStore.currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <RadioGroup
              value={form.status}
              onValueChange={(v) => handleChange("status", v)}
              className="flex gap-3"
            >
              {["pending", "cleared", "void", "failed"].map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <RadioGroupItem value={s} id={`status-${s}`} />
                  <Label htmlFor={`status-${s}`}>{s}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Amount */}
          <div>
            <Label>Amount</Label>
            <Input
              type="text"
              value={form.amount || ""}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
            />
            {renderError("amount")}
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Calendar28
              value={form.transactionDate}
              onChange={(date) => handleChange("transactionDate", date)}
            />
            {renderError("transactionDate")}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* External Ref */}
          <div>
            <Label>External Ref</Label>
            <Input
              value={form.externalRefId || ""}
              onChange={(e) => handleChange("externalRefId", e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <Label>Recurring</Label>
            <input
              type="checkbox"
              checked={form.recurring || false}
              onChange={(e) => handleChange("recurring", e.target.checked)}
            />
          </div>

          {/* Recurring Interval */}
          {form.recurring && (
            <div>
              <Label>Recurring Interval</Label>
              <RadioGroup
                value={form.recurringInterval}
                onValueChange={(v) => handleChange("recurringInterval", v)}
                className="flex gap-3"
              >
                {["daily", "weekly", "monthly", "yearly"].map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <RadioGroupItem value={r} id={`recurring-${r}`} />
                    <Label htmlFor={`recurring-${r}`}>{r}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
