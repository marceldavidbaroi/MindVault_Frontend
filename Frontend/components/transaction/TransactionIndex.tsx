"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "./AccountList";
import { AccessAccount } from "@/types/Account.type";
import { useAccountStore } from "@/store/accountStore";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Compass } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";
import {
  TransactionDialog,
  TransactionDialogData,
} from "./TransactionFormModal";

interface TransactionIndexProps {
  selectedAccountId: string | number | null;
}

const TransactionIndex: React.FC<TransactionIndexProps> = ({
  selectedAccountId,
}) => {
  const accountStore = useAccountStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();

  const getInitialData = async () => {
    await Promise.all([
      accountStore.getAccountsWithAccess(),
      categoryStore.getAllCategories(),
      currencyStore.getAllCurrencies(),
    ]);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    accountStore.setSelectedAccountId(selectedAccountId);
  }, [selectedAccountId]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // For edit mode (null = create mode)
  const [editData, setEditData] = useState<TransactionDialogData | undefined>(
    undefined
  );

  // open create dialog
  const handleAddTransaction = () => {
    setEditData(undefined);
    setDialogOpen(true);
  };

  // open edit dialog
  const openEditDialog = () => {
    setEditData({
      accountId: 3,
      categoryId: 2,
      type: "expense",
      amount: "120.50",
      currencyCode: "USD",
      transactionDate: "2025-11-17",
      description: "Lunch with team",
      status: "pending",
      recurring: false,
    });
    setDialogOpen(true);
  };

  // handle save
  const handleSubmit = async (data: TransactionDialogData) => {
    console.log("Submitted: ", data);

    // TODO: call your API here

    // close dialog
    setDialogOpen(false);
  };

  const handleBulkTransaction = () => console.log("Bulk Transaction clicked");
  const handleExplorer = () => console.log("Explorer clicked");

  return (
    <div className="h-[80vh] grid grid-cols-12 gap-3 p-3">
      {/* LEFT SIDEBAR - GLASS */}
      <div
        className="
          col-span-2 h-full
          rounded-xl
          backdrop-blur-md
          bg-white/10 dark:bg-black/20
          flex flex-col
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent
        "
      >
        <AccountsList />
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-10 grid grid-rows-[5%_25%_70%] gap-3">
        {/* BUTTONS ROW - RIGHT ALIGNED */}
        <div className="flex justify-end gap-1">
          <Button
            className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-110"
            onClick={handleAddTransaction}
          >
            <Plus size={16} />
          </Button>

          <Button
            className="flex items-center gap-2 bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:brightness-110"
            onClick={handleBulkTransaction}
          >
            <Layers size={16} />
          </Button>

          <Button
            className="flex items-center gap-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:brightness-110"
            onClick={handleExplorer}
          >
            <Compass size={16} />
          </Button>
        </div>

        {/* TOP SECTION - GLASS */}
        <div
          className="
            rounded-xl
            backdrop-blur-md
            bg-white/10 dark:bg-black/20
            border border-white/20 dark:border-white/10
            shadow-md
            p-4
          "
        >
          <h2 className="text-lg font-semibold">Top Section</h2>
        </div>

        {/* BOTTOM SECTION (split 5 + 5) */}
        <div className="grid grid-cols-10 gap-3">
          <div
            className="
              col-span-5
              rounded-xl
              backdrop-blur-md
              bg-white/10 dark:bg-black/20
              border border-white/20 dark:border-white/10
              shadow-md
              p-4
            "
          >
            <h2 className="text-lg font-semibold">Bottom Left</h2>
          </div>

          <div
            className="
              col-span-5
              rounded-xl
              backdrop-blur-md
              bg-white/10 dark:bg-black/20
              border border-white/20 dark:border-white/10
              shadow-md
              p-4
            "
          >
            <h2 className="text-lg font-semibold">Bottom Right</h2>
          </div>
        </div>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={editData}
      />
    </div>
  );
};

export default TransactionIndex;
