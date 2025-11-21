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
import { Calendar28 } from "../ui/date-picker";
import { format } from "date-fns";
import { useAccountStore } from "@/store/accountStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { useTransactionStore } from "@/store/transactionStore";

interface BulkTransactionItem {
  amount: string;
  categoryId?: number;
  transactionDate?: string;
  externalRefId?: string;
}

interface BulkCreateTransactionForm {
  accountId: number;
  type: "income" | "expense";
  currencyCode: string;
  description?: string;
  status: "pending" | "completed" | "failed";
  recurring: boolean;
  recurringInterval: "daily" | "weekly" | "monthly" | "yearly";
  transactions: BulkTransactionItem[];
}

interface BulkTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

const getDefaultTransaction = (): BulkTransactionItem => ({
  amount: "",
  categoryId: undefined,
  transactionDate: format(new Date(), "yyyy-MM-dd"),
  externalRefId: undefined,
});

export const BulkTransactionDialog: React.FC<BulkTransactionDialogProps> = ({
  open,
  onClose,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();
  const transactionStore = useTransactionStore();

  const [form, setForm] = useState<BulkCreateTransactionForm>({
    accountId: 0, // temporary default
    type: "expense",
    currencyCode: "USD",
    description: "",
    status: "pending",
    recurring: false,
    recurringInterval: "daily",
    transactions: [getDefaultTransaction()],
  });

  useEffect(() => {
    if (accountStore.selectedAccountId) {
      setForm((prev) => ({
        ...prev,
        accountId: Number(accountStore.selectedAccountId),
        currencyCode:
          accountStore.selectedAccount?.currency?.code || prev.currencyCode,
      }));
    }
  }, [
    accountStore.selectedAccountId,
    accountStore.selectedAccount?.currency?.code,
  ]);

  const handleChange = <K extends keyof BulkCreateTransactionForm>(
    key: K,
    value: BulkCreateTransactionForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTransactionChange = <K extends keyof BulkTransactionItem>(
    index: number,
    key: K,
    value: BulkTransactionItem[K]
  ) => {
    const updated = [...form.transactions];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, transactions: updated }));
  };

  const addTransaction = () => {
    setForm((prev) => ({
      ...prev,
      transactions: [...prev.transactions, getDefaultTransaction()],
    }));
  };

  const removeTransaction = (index: number) => {
    const updated = [...form.transactions];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, transactions: updated }));
  };
  const handleSubmit = async () => {
    // Prepare payload
    const payload: BulkCreateTransactionForm = {
      ...form,
      transactions: form.transactions.map((tx) => {
        const { externalRefId, ...rest } = tx;
        return externalRefId?.trim()
          ? { ...rest, externalRefId: externalRefId.trim() }
          : { ...rest }; // omit field if empty
      }),
    };

    await transactionStore.createBulkTransactions(payload);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Transaction</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Common Fields */}
          <div>
            <Label>Account</Label>
            <Select
              value={String(form.accountId)}
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

          <div>
            <Label>Type</Label>
            <RadioGroup
              value={form.type}
              onValueChange={(v) =>
                handleChange("type", v as "income" | "expense")
              }
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

          <div>
            <Label>Description</Label>
            <Input
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <RadioGroup
              value={form.status}
              onValueChange={(v) =>
                handleChange("status", v as "pending" | "completed" | "failed")
              }
            >
              {["pending", "completed", "failed"].map((s) => (
                <div key={s} className="flex items-center space-x-2">
                  <RadioGroupItem value={s} id={`status-${s}`} />
                  <Label htmlFor={`status-${s}`}>{s}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Transactions List */}
          {form.transactions.map((tx, idx) => (
            <div key={idx} className="border p-3 rounded-md grid gap-2">
              <div className="flex justify-between items-center">
                <Label>Transaction #{idx + 1}</Label>
                {form.transactions.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTransaction(idx)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div>
                <Label>Amount</Label>
                <Input
                  value={tx.amount}
                  onChange={(e) =>
                    handleTransactionChange(idx, "amount", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={tx.categoryId ? String(tx.categoryId) : undefined}
                  onValueChange={(v) =>
                    handleTransactionChange(idx, "categoryId", Number(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryStore.categories
                      .filter((c) => c.type === form.type)
                      .map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Transaction Date</Label>
                <Calendar28
                  value={tx.transactionDate}
                  onChange={(d) =>
                    handleTransactionChange(idx, "transactionDate", d)
                  }
                />
              </div>

              <div>
                <Label>External Ref</Label>
                <Input
                  value={tx.externalRefId}
                  onChange={(e) =>
                    handleTransactionChange(
                      idx,
                      "externalRefId",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}

          <Button onClick={addTransaction}>Add Another Transaction</Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
