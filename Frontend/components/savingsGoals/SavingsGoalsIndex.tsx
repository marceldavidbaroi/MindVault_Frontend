"use client";

import { useSavingsGoalsStore } from "@/store/savingsGoalsStore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SavingsGoalFormDialog } from "./SavingsGoalFormDialog";
import { useAccountStore } from "@/store/accountStore";
import { useCurrencyStore } from "@/store/currencyStore";
import SavingsGoalsList from "./SavingsGoalsList";

const SavingsGoalsIndex = () => {
  const savingsGoalStore = useSavingsGoalsStore();
  const accountStore = useAccountStore();
  const currencyStore = useCurrencyStore();
  const [openCreate, setOpenCreate] = useState(false);
  const init = async () => {
    savingsGoalStore.getMyGoals();
    if (accountStore.accountTypes.length === 0) {
      await accountStore.getAllAccountTypes();
    }
    if (currencyStore.currencies.length === 0) {
      await currencyStore.getAllCurrencies();
    }
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">My Savings Goals</h2>

        <Button onClick={() => setOpenCreate(true)}>Create Goal</Button>
      </div>

      <SavingsGoalsList />

      <SavingsGoalFormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};

export default SavingsGoalsIndex;
