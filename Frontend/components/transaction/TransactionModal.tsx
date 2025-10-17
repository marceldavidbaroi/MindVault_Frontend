"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
}) => {
  const [form, setForm] = useState<CreateTransactionDto>({
    type: "income",
    categoryId: 0,
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurring: false,
    recurringInterval: undefined,
  });

  const handleChange = (key: keyof CreateTransactionDto, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Transaction Data:", form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md w-full bg-card border border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground font-bold">
            Add Transaction
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            Fill in the details for your new transaction
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
          </div>

          {/* CategoryId */}
          <div className="flex flex-col gap-1">
            <Label>Category ID</Label>
            <Input
              type="number"
              value={form.categoryId || ""}
              onChange={(e) =>
                handleChange("categoryId", Number(e.target.value))
              }
              placeholder="Enter category ID"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <Label>Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => handleChange("amount", Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <Label>Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
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

          {/* Recurring Interval */}
          {form.recurring && (
            <div className="flex flex-col gap-1">
              <Label>Recurring Interval</Label>
              <Select
                value={form.recurringInterval || ""}
                onValueChange={(val) => handleChange("recurringInterval", val)}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
