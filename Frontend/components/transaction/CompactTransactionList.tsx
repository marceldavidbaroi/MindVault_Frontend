"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useTransactionStore } from "@/store/transactionStore";

export default function CompactTransactionList() {
  const { transactions } = useTransactionStore();

  const handleEdit = (id: number) => {
    console.log("Edit transaction", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete transaction", id);
  };

  return (
    <div className="w-full h-full p-3 space-y-3 backdrop-blur-md bg-background/60 rounded-xl border border-white/20 shadow-md">
      {transactions?.items.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 rounded-lg bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 transition"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-sm capitalize">{tx.type}</span>
            <span className="text-xs opacity-70">{tx.transactionDate}</span>
            <span className="text-xs">{tx.category.name}</span>
          </div>

          <div className="text-right">
            <span
              className={`font-bold text-sm ${
                tx.type === "income" ? "" : "text-primary"
              }`}
            >
              {tx.currency.symbol} {tx.amount}
            </span>
            <div className="text-xs opacity-60 capitalize">{tx.status}</div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/20"
              onClick={() => handleEdit(tx.id)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/20"
              onClick={() => handleDelete(tx.id)}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
