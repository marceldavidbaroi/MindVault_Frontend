"use client";

import React, { useState } from "react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useCategoryStore } from "@/store/categoryStore";
import { Trash } from "lucide-react";
import { useTransactionStore } from "@/store/transactionStore";

interface TransactionItemDto {
  categoryId: number;
  amount?: number;
}

interface BulkTransactionDto {
  date: string; // ISO string
  type: "income" | "expense";
  transactions: TransactionItemDto[];
}

interface BulkTransactionModalProps {
  open: boolean;
  onClose: () => void;
  type: "income" | "expense";
}

const BulkTransactionModal: React.FC<BulkTransactionModalProps> = ({
  open,
  onClose,
  type,
}) => {
  const { categories } = useCategoryStore();
  const transactionStore = useTransactionStore();

  const [date, setDate] = useState(new Date());
  const [transactions, setTransactions] = useState<TransactionItemDto[]>([
    { categoryId: 0, amount: undefined },
  ]);

  const [errors, setErrors] = useState<
    { categoryId?: string; amount?: string }[]
  >([{ categoryId: "", amount: "" }]);

  const resetForm = () => {
    setDate(new Date());
    setTransactions([{ categoryId: 0, amount: undefined }]);
    setErrors([{ categoryId: "", amount: "" }]);
  };

  const handleTransactionChange = (
    index: number,
    key: keyof TransactionItemDto,
    value: any
  ) => {
    const updated = [...transactions];
    updated[index][key] =
      key === "amount" ? (value !== "" ? Number(value) : undefined) : value;
    setTransactions(updated);

    const updatedErrors = [...errors];
    if (key === "categoryId") updatedErrors[index].categoryId = "";
    if (key === "amount") updatedErrors[index].amount = "";
    setErrors(updatedErrors);
  };

  const addTransactionRow = () => {
    setTransactions([...transactions, { categoryId: 0, amount: undefined }]);
    setErrors([...errors, { categoryId: "", amount: "" }]);
  };

  const removeTransactionRow = (index: number) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);

    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  const handleSave = async () => {
    e;
    let hasError = false;
    const newErrors = transactions.map((tx) => {
      const err: { categoryId?: string; amount?: string } = {};
      if (!tx.categoryId) {
        err.categoryId = "Category is required";
        hasError = true;
      }
      if (!tx.amount || tx.amount <= 0) {
        err.amount = "Amount must be greater than 0";
        hasError = true;
      }
      return err;
    });

    setErrors(newErrors);
    if (hasError) return;

    const payload: BulkTransactionDto = {
      date: date.toISOString().split("T")[0],
      type,
      transactions,
    };
    console.log("Bulk transaction payload:", payload);
    await transactionStore.createBulkTransactions(payload);

    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg w-full bg-card border border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Bulk {type.charAt(0).toUpperCase() + type.slice(1)} Transactions
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            Add multiple {type} transactions for a single date.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date */}
          <div className="flex flex-col gap-1">
            <Label>Date</Label>
            <DatePicker
              selected={date}
              onSelect={(d) => setDate(d)}
              placeholder="Select date"
            />
          </div>

          {/* Transactions */}
          <div className="flex flex-col gap-4">
            {transactions.map((tx, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                {/* Category */}
                <div className="col-span-5 flex flex-col gap-1">
                  <Label>Category</Label>
                  <Select
                    value={tx.categoryId ? String(tx.categoryId) : ""}
                    onValueChange={(val) =>
                      handleTransactionChange(idx, "categoryId", Number(val))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(categories ?? [])
                        .filter((c) => c.type === type)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.displayName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors[idx]?.categoryId && (
                    <span className="text-red-500 text-xs mt-0.5">
                      {errors[idx].categoryId}
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div className="col-span-5 flex flex-col gap-1">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={tx.amount ?? ""}
                    onChange={(e) =>
                      handleTransactionChange(idx, "amount", e.target.value)
                    }
                    placeholder="Enter amount"
                  />
                  {errors[idx]?.amount && (
                    <span className="text-red-500 text-xs mt-0.5">
                      {errors[idx].amount}
                    </span>
                  )}
                </div>

                {/* Remove icon button */}
                <div className="col-span-2 flex justify-center items-center mt-5">
                  {transactions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTransactionRow(idx)}
                      className="text-red-500 hover:bg-red-100"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addTransactionRow}>
              Add Another Transaction
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkTransactionModal;
