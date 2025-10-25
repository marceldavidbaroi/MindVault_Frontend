"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactionStore } from "@/store/transactionStore";
import TransactionModal from "./TransactionModal";

interface Category {
  id: number;
  name: string;
  displayName: string;
  type: "income" | "expense";
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: Category;
  amount: string;
  date: string;
  description: string;
  recurring: boolean;
  recurringInterval: string | null;
}

interface TransactionListProps {
  data?: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ data }) => {
  const transactions = data ?? [];
  const transactionStore = useTransactionStore();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const getAll = async () => {
    await transactionStore.getAllTransactions();
  };

  useEffect(() => {
    getAll();
  }, []);

  const handleDoubleClick = (tx: Transaction) => {
    console.log("Transaction details:", tx);
    setSelectedTransaction(tx);
    setShowEditDialog(true);
  };

  return (
    <Card className="w-full bg-card/60 backdrop-blur-md border border-border shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-bold">
          Transactions
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full">
          <ul className="divide-y divide-border">
            {transactionStore.transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex justify-between items-center px-4 py-3 hover:bg-white/10 transition-colors rounded-md cursor-pointer"
                onDoubleClick={() => handleDoubleClick(tx)} // 👈 added
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {tx.category?.displayName}
                  </span>
                  <span className="text-xs text-foreground/70">
                    {new Date(tx.date).toLocaleDateString()}{" "}
                    {tx.description && `• ${tx.description}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={tx.type === "income" ? "secondary" : "destructive"}
                    className="px-2 py-1 text-xs"
                  >
                    {tx.type.toUpperCase()}
                  </Badge>
                  <span
                    className={`text-sm font-bold ${
                      tx.type === "income"
                        ? "text-[hsl(var(--chart-1))]"
                        : "text-[hsl(var(--destructive))]"
                    }`}
                  >
                    {parseFloat(tx.amount).toLocaleString()} ৳
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
      <TransactionModal
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        transaction={selectedTransaction} // <--- this controls edit mode
      />
    </Card>
  );
};

export default TransactionList;
