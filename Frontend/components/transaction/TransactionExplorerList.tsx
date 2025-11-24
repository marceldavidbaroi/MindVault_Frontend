"use client";

import React from "react";
import { useTransactionStore } from "@/store/transactionStore";
import { format } from "date-fns";

export const TransactionExplorerList: React.FC = () => {
  const transactionStore = useTransactionStore();

  return (
    <div className="flex flex-col p-2 text-sm">
      {/* Header */}
      <div className="grid grid-cols-5 gap-2 px-3 py-1 font-semibold text-muted-foreground">
        <div>Date</div>
        <div>Category</div>
        <div>User</div>
        <div className="text-right">Amount</div>
        <div>Type</div>
      </div>

      {/* Rows */}
      {transactionStore.transactions.map((tx) => {
        const isExpense = tx.type === "expense";
        const amountColor = isExpense ? "text-primary" : "text-foreground";

        return (
          <div
            key={tx.id}
            onClick={() => console.log(tx.id)}
            className="cursor-pointer grid grid-cols-5 gap-2 items-center p-2 backdrop-blur-md transition hover:scale-[1.01] duration-150 rounded-md border border-white/10"
          >
            <div>{format(new Date(tx.transactionDate), "MMM dd, yyyy")}</div>
            <div>{tx.category.name}</div>
            <div>@{tx.creatorUser.username}</div>
            <div className={`text-right font-semibold ${amountColor}`}>
              {tx.currency.symbol}
              {Number(tx.amount).toFixed(2)}
            </div>
            <div className="capitalize">{tx.type}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionExplorerList;
