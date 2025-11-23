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
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { useTransactionRefresh } from "@/composables/finance/transaction/useTransactionRefresh";

// --- API Types ---
export interface BulkTransactionItem {
  amount: string;
  categoryId?: number;
  transactionDate?: string;
  externalRefId?: string;
}

export interface BulkCreateTransaction {
  accountId: number;
  type?: "income" | "expense";
  currencyCode?: string;
  description?: string;
  status?: "pending" | "completed" | "failed";
  recurring?: boolean;
  recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
  transactions: BulkTransactionItem[];
}

// --- Component Internal Types ---
interface FormTransactionItem {
  amount: string;
  categoryId: number | undefined;
  transactionDate: string;
  externalRefId: string | undefined;
}

interface BulkCreateTransactionForm {
  accountId: number;
  type: "income" | "expense";
  currencyCode: string;
  status: "pending" | "completed" | "failed";
  description: string;
  recurring: boolean;
  recurringInterval: "daily" | "weekly" | "monthly" | "yearly";
  transactions: FormTransactionItem[];
}

interface BulkTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

// --- Utility Functions ---
const getDefaultTransaction = (): FormTransactionItem => ({
  amount: "",
  categoryId: undefined,
  transactionDate: format(new Date(), "yyyy-MM-dd"),
  externalRefId: undefined,
});

const getInitialFormState = (
  selectedAccountId: number | null, // <-- Expects number | null
  defaultCurrencyCode: string
): BulkCreateTransactionForm => ({
  accountId: selectedAccountId || 0,
  type: "expense",
  currencyCode: defaultCurrencyCode,
  description: "",
  status: "pending",
  recurring: false,
  recurringInterval: "daily",
  transactions: [getDefaultTransaction()],
});

// --- Component ---
export const BulkTransactionDialog: React.FC<BulkTransactionDialogProps> = ({
  open,
  onClose,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();
  const transactionStore = useTransactionStore();
  const { refreshAll } = useTransactionRefresh();

  // FIX: Safely convert selectedAccountId to number or null for type compatibility
  const getNumericAccountId = (id: string | number | null) =>
    id ? Number(id) : null;

  const initialAccountId = getNumericAccountId(accountStore.selectedAccountId);
  const initialCurrency = accountStore.selectedAccount?.currency?.code || "USD";

  const [form, setForm] = useState<BulkCreateTransactionForm>(
    getInitialFormState(initialAccountId, initialCurrency)
  );

  const [errors, setErrors] = useState<
    Record<number, { amount?: string; categoryId?: string }>
  >({});

  // Reset form when dialog closes/opens
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setForm(
          getInitialFormState(
            getNumericAccountId(accountStore.selectedAccountId),
            accountStore.selectedAccount?.currency?.code || "USD"
          )
        );
        setErrors({});
      }, 100);
    }
  }, [
    open,
    accountStore.selectedAccountId,
    accountStore.selectedAccount?.currency?.code,
  ]);

  // Update account/currency on initial load or account change
  useEffect(() => {
    if (accountStore.selectedAccountId) {
      // FIX: Ensure Number() conversion when setting state
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

  const handleTransactionChange = <K extends keyof FormTransactionItem>(
    index: number,
    key: K,
    value: FormTransactionItem[K]
  ) => {
    const updated = [...form.transactions];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, transactions: updated }));

    if (errors[index]?.[key as "amount" | "categoryId"]) {
      const newErrors = { ...errors };
      delete newErrors[index]?.[key as "amount" | "categoryId"];
      if (Object.keys(newErrors[index] || {}).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
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

    const newErrors = { ...errors };
    delete newErrors[index];
    const reIndexedErrors: typeof errors = {};
    Object.keys(newErrors).forEach((key) => {
      const idx = Number(key);
      if (idx > index) {
        reIndexedErrors[idx - 1] = newErrors[idx];
      } else {
        reIndexedErrors[idx] = newErrors[idx];
      }
    });
    setErrors(reIndexedErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    form.transactions.forEach((tx, index) => {
      let txErrors: { amount?: string; categoryId?: string } = {};

      // 1. Amount validation
      const amountValue = tx.amount.trim();
      if (!amountValue) {
        txErrors.amount = "Amount is required.";
      } else if (isNaN(Number(amountValue)) || Number(amountValue) <= 0) {
        txErrors.amount = "Must be a positive number.";
      }

      // 2. Category validation
      if (!tx.categoryId) {
        txErrors.categoryId = "Category is required.";
      }

      if (Object.keys(txErrors).length > 0) {
        newErrors[index] = txErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Prepare payload, mapping FormTransactionItem to BulkTransactionItem
    const payload: BulkCreateTransaction = {
      accountId: form.accountId,
      type: form.type,
      currencyCode: form.currencyCode,
      description: form.description.trim() || undefined,
      status: form.status,
      recurring: form.recurring,
      recurringInterval: form.recurringInterval,
      transactions: form.transactions.map((tx) => {
        const base: BulkTransactionItem = {
          amount: tx.amount,
        };

        // Include categoryId only if it's set
        if (tx.categoryId !== undefined) {
          base.categoryId = tx.categoryId;
        }

        // Include transactionDate only if it's not the default today's date
        if (
          tx.transactionDate &&
          tx.transactionDate !== format(new Date(), "yyyy-MM-dd")
        ) {
          base.transactionDate = tx.transactionDate;
        }

        // Include externalRefId only if it's non-empty
        if (tx.externalRefId?.trim()) {
          base.externalRefId = tx.externalRefId.trim();
        }

        return base;
      }),
    };

    await transactionStore.createBulkTransactions(payload);
    await refreshAll(Number(accountStore.selectedAccountId));
    onClose();
  };

  const filteredCategories = categoryStore.categories.filter(
    (c) => c.type === form.type
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Transaction Entry</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* --- Common Fields Section (Account, Type, Currency, Description, Status) --- */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <Label htmlFor="account-select" className="mb-1 block">
                Account
              </Label>
              <Select
                value={String(form.accountId)}
                onValueChange={(v) => handleChange("accountId", Number(v))}
              >
                <SelectTrigger id="account-select">
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
              <Label htmlFor="type-radio" className="mb-1 block">
                Type
              </Label>
              <RadioGroup
                id="type-radio"
                className="flex space-x-4 pt-2"
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
              <Label htmlFor="currency-select" className="mb-1 block">
                Currency
              </Label>
              <Select
                value={form.currencyCode}
                onValueChange={(v) => handleChange("currencyCode", v)}
              >
                <SelectTrigger id="currency-select">
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
              <Label htmlFor="status-radio" className="mb-1 block">
                Status
              </Label>
              <RadioGroup
                id="status-radio"
                className="flex space-x-4 pt-2"
                value={form.status}
                onValueChange={(v) =>
                  handleChange(
                    "status",
                    v as "pending" | "completed" | "failed"
                  )
                }
              >
                {["pending", "completed", "failed"].map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <RadioGroupItem value={s} id={`status-${s}`} />
                    <Label htmlFor={`status-${s}`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <Label htmlFor="description-input" className="mb-1 block">
              Common Description (Optional)
            </Label>
            <Input
              id="description-input"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g., Monthly software licenses"
            />
          </div>

          {/* --- Transactions List --- */}
          <h3 className="text-lg font-semibold border-b pb-2">
            Individual Transactions
          </h3>
          {form.transactions.map((tx, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-lg bg-secondary/10 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Transaction #{idx + 1}</h4>
                {form.transactions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTransaction(idx)}
                    title="Remove Transaction"
                    className="text-red-500 hover:bg-red-100/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Amount */}
                <div className="flex flex-col">
                  <Label htmlFor={`amount-${idx}`} className="mb-1">
                    Amount *
                  </Label>
                  <Input
                    id={`amount-${idx}`}
                    value={tx.amount}
                    onChange={(e) =>
                      handleTransactionChange(idx, "amount", e.target.value)
                    }
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    className={errors[idx]?.amount ? "border-red-500" : ""}
                  />
                  {errors[idx]?.amount && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors[idx].amount}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="flex flex-col">
                  <Label htmlFor={`category-${idx}`} className="mb-1">
                    Category *
                  </Label>
                  <Select
                    value={tx.categoryId ? String(tx.categoryId) : ""}
                    onValueChange={(v) =>
                      handleTransactionChange(idx, "categoryId", Number(v))
                    }
                  >
                    <SelectTrigger
                      id={`category-${idx}`}
                      className={
                        errors[idx]?.categoryId ? "border-red-500" : ""
                      }
                    >
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
                  {errors[idx]?.categoryId && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors[idx].categoryId}
                    </p>
                  )}
                </div>

                {/* Transaction Date */}
                <div className="flex flex-col">
                  <Label htmlFor={`date-${idx}`} className="mb-1">
                    Transaction Date
                  </Label>
                  <Calendar28
                    value={tx.transactionDate}
                    onChange={(d) =>
                      handleTransactionChange(idx, "transactionDate", d)
                    }
                  />
                </div>

                {/* External Ref */}
                <div className="flex flex-col">
                  <Label htmlFor={`ref-${idx}`} className="mb-1">
                    External Ref (Optional)
                  </Label>
                  <Input
                    id={`ref-${idx}`}
                    value={tx.externalRefId || ""}
                    onChange={(e) =>
                      handleTransactionChange(
                        idx,
                        "externalRefId",
                        e.target.value
                      )
                    }
                    placeholder="Invoice ID / Ref #"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addTransaction} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Another Transaction
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            Save All ({form.transactions.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
