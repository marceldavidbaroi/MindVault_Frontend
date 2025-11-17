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
import { DatePicker } from "../ui/date-picker";

export type TransactionDialogData = {
  accountId?: number | null;
  categoryId?: number;
  type?: "income" | "expense";
  amount?: string;
  currencyCode?: string;
  transactionDate?: string;
  description?: string;
  status?: "pending" | "cleared" | "void" | "failed";
  externalRefId?: string;
  recurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
};

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: TransactionDialogData;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  open,
  onClose,
  initialData,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();

  const [form, setForm] = useState<TransactionDialogData>({
    type: "income",
    status: "pending",
    recurring: false,
    recurringInterval: "daily",
    transactionDate: format(new Date(), "yyyy-MM-dd"),
    ...initialData,
  });

  const filteredCategories = categoryStore.categories.filter(
    (c) => c.type === form.type
  );

  const handleChange = (key: keyof TransactionDialogData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const account = accountStore.accessAccounts.find(
      (acc) => acc.id === accountStore.selectedAccountId
    );
    console.log(account);
  }, [accountStore.selectedAccountId]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("Submitting transaction payload: ", form);

      onClose();
    } catch (err: any) {
      console.error("Transaction save error:", err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
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
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <DatePicker
              selected={
                form.transactionDate
                  ? new Date(form.transactionDate)
                  : undefined
              }
              onSelect={(date) =>
                handleChange(
                  "transactionDate",
                  date.toISOString().split("T")[0]
                )
              }
              placeholder="Pick a date"
            />
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
          </Button>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
