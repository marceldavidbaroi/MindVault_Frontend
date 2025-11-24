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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useAccountStore } from "@/store/accountStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useUserStore } from "@/store/userStore";
import { useSummaryStore } from "@/store/summaryStore";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";
import { CreateTransactionDto } from "@/types/Transaction.type";

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: CreateTransactionDto;
  triggerRefreshAll?: Boolean;
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
  triggerRefreshAll = true,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();
  const transactionStore = useTransactionStore();
  const userStore = useUserStore();
  const summaryStore = useSummaryStore();
  const { refreshAll, refreshTransactions } = useTransactionRefresh();

  const [form, setForm] = useState<Partial<CreateTransactionDto>>(
    getDefaultForm(accountStore.selectedAccount?.currency?.code, initialData)
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTransactionDto, string>>
  >({});

  useEffect(() => {
    setForm(
      getDefaultForm(accountStore.selectedAccount?.currency?.code, initialData)
    );
    setErrors({});
  }, [initialData, accountStore.selectedAccount?.currency?.code]);

  const handleChange = (key: keyof CreateTransactionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

      if (initialData?.id) {
        await transactionStore.updateTransaction(initialData.id, payload);
      } else {
        await transactionStore.createTransaction(payload);
      }
      if (triggerRefreshAll) {
        await refreshAll(Number(accountStore.selectedAccountId));
      } else {
        await refreshTransactions(
          Number(accountStore.selectedAccountId),
          transactionStore.filters
        );
      }
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
      <DialogContent className="sm:max-w-lg max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400 scrollbar-track-transparent p-6 space-y-6 rounded-xl">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Edit Transaction" : "Create Transaction"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="grid gap-6">
          {/* Account */}
          <div className="space-y-2">
            <Label>Account</Label>
            <Select
              value={
                form.accountId
                  ? String(form.accountId)
                  : String(accountStore.selectedAccountId)
              }
              onValueChange={(v) => handleChange("accountId", Number(v))}
            >
              <SelectTrigger className="h-10">
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
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              value={form.type}
              onValueChange={(v) => handleChange("type", v)}
              className="flex gap-6 pt-1"
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
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId ? String(form.categoryId) : undefined}
              onValueChange={(v) => handleChange("categoryId", Number(v))}
            >
              <SelectTrigger className="h-10">
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
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={form.currencyCode}
              onValueChange={(v) => handleChange("currencyCode", v)}
            >
              <SelectTrigger className="h-10">
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
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={form.status}
              onValueChange={(v) => handleChange("status", v)}
              className="flex flex-wrap gap-4 pt-1"
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
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="text"
              className="h-10"
              value={form.amount || ""}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
            />
            {renderError("amount")}
          </div>

          {/* Date with Popover Calendar */}
          <div className="flex flex-col">
            <Label htmlFor="transaction-date" className="mb-1">
              Transaction Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {form.transactionDate
                    ? format(new Date(form.transactionDate), "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]">
                <Calendar
                  mode="single"
                  selected={
                    form.transactionDate
                      ? new Date(form.transactionDate)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (date)
                      handleChange(
                        "transactionDate",
                        format(date, "yyyy-MM-dd")
                      );
                  }}
                  className="rounded-md border shadow-sm"
                />
              </PopoverContent>
            </Popover>
            {renderError("transactionDate")}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              className="h-10"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional"
            />
          </div>

          {/* External Ref */}
          <div className="space-y-2">
            <Label>External Ref</Label>
            <Input
              className="h-10"
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
            <div className="space-y-2">
              <Label>Recurring Interval</Label>
              <RadioGroup
                value={form.recurringInterval}
                onValueChange={(v) => handleChange("recurringInterval", v)}
                className="flex gap-6 pt-1"
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

        <DialogFooter className="pt-4 border-t">
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
