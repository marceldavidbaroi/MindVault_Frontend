"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactionStore } from "@/store/transactionStore";

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
  const transactions = data ?? [
    {
      id: 1,
      type: "income",
      category: {
        id: 1,
        name: "salary",
        displayName: "Salary",
        type: "income",
      },
      amount: "2500.00",
      date: "2025-10-01",
      description: "October salary",
      recurring: true,
      recurringInterval: "monthly",
    },
    {
      id: 2,
      type: "expense",
      category: {
        id: 2,
        name: "shopping",
        displayName: "Shopping",
        type: "expense",
      },
      amount: "560.00",
      date: "2025-10-02",
      description: "Bought clothes",
      recurring: false,
      recurringInterval: null,
    },
    {
      id: 3,
      type: "income",
      category: {
        id: 3,
        name: "investment",
        displayName: "Investment",
        type: "income",
      },
      amount: "200.00",
      date: "2025-10-03",
      description: "Stock dividends",
      recurring: false,
      recurringInterval: null,
    },
    {
      id: 4,
      type: "expense",
      category: {
        id: 4,
        name: "entertainment",
        displayName: "Entertainment",
        type: "expense",
      },
      amount: "150.00",
      date: "2025-10-04",
      description: "Movie and snacks",
      recurring: false,
      recurringInterval: null,
    },
    {
      id: 5,
      type: "income",
      category: {
        id: 5,
        name: "freelance",
        displayName: "Freelance",
        type: "income",
      },
      amount: "500.00",
      date: "2025-10-05",
      description: "Website project",
      recurring: false,
      recurringInterval: null,
    },
  ];
  const transactionStore = useTransactionStore();
  const getAll = async () => {
    await transactionStore.getAllTransactions();
  };

  useEffect(() => {
    getAll();
  }, []);

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
                className="flex justify-between items-center px-4 py-3 hover:bg-white/10 transition-colors rounded-md"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {tx.category.displayName}
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
    </Card>
  );
};

export default TransactionList;
