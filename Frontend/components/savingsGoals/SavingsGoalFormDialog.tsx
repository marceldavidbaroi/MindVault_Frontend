"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { useSavingsGoalsStore } from "@/store/savingsGoalsStore";
import { useAccountStore } from "@/store/accountStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { SavingsGoal } from "@/types/SavingsGoal.type";

interface Props {
  open: boolean;
  onClose: () => void;
  goal?: SavingsGoal; // for editing
}

export const SavingsGoalFormDialog: React.FC<Props> = ({
  open,
  onClose,
  goal,
}) => {
  const savingsStore = useSavingsGoalsStore();
  const accountStore = useAccountStore();
  const currencyStore = useCurrencyStore();

  const [form, setForm] = useState({
    name: "",
    purpose: "",
    targetAmount: "",
    currencyCode: "",
    accountTypeId: "",
    targetDate: "" as string | null,
  });

  const currencies = currencyStore.currencies || [];
  const accountTypes = accountStore.accountTypes || [];

  // Prefill when editing
  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name,
        purpose: goal.purpose ?? "",
        targetAmount: goal.target_amount.toString(),
        currencyCode: goal.account?.currency?.code,
        accountTypeId: goal?.account?.type?.id?.toString() ?? "",
        targetDate: goal.target_date ? goal.target_date.split("T")[0] : null,
      });
    } else {
      setForm({
        name: "",
        purpose: "",
        targetAmount: "",
        currencyCode: "",
        accountTypeId: "",
        targetDate: null,
      });
    }
  }, [goal, open]);

  const handleChange = (key: string, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      purpose: form.purpose || undefined,
      targetAmount: form.targetAmount,
      currencyCode: form.currencyCode,
      accountTypeId: Number(form.accountTypeId),
      targetDate: form.targetDate || undefined,
    };

    let res;
    if (goal) {
      res = await savingsStore.updateGoal(goal.id, payload);
    } else {
      res = await savingsStore.createGoal(payload);
    }

    if (res.success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Edit Savings Goal" : "Create Savings Goal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Goal name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Purpose */}
          <div>
            <Label>Purpose</Label>
            <Input
              placeholder="Purpose (optional)"
              value={form.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
          </div>

          {/* Target Amount */}
          <div>
            <Label>Target Amount</Label>
            <Input
              type="number"
              value={form.targetAmount}
              onChange={(e) => handleChange("targetAmount", e.target.value)}
            />
          </div>

          {/* Currency */}
          <div>
            <Label>Currency</Label>
            <Select
              value={form.currencyCode}
              onValueChange={(val) => handleChange("currencyCode", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Type */}
          <div>
            <Label>Account Type</Label>
            <Select
              value={form.accountTypeId}
              onValueChange={(val) => handleChange("accountTypeId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target Date */}
          <div className="flex flex-col">
            <Label>Target Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  {form.targetDate
                    ? format(new Date(form.targetDate), "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]">
                <Calendar
                  mode="single"
                  selected={
                    form.targetDate ? new Date(form.targetDate) : undefined
                  }
                  onSelect={(date) => {
                    if (date)
                      handleChange("targetDate", format(date, "yyyy-MM-dd"));
                  }}
                  className="rounded-md border shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {goal ? "Update Goal" : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
