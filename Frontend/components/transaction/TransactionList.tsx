"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransactionStore } from "@/store/transactionStore";
import TransactionModal from "./TransactionModal";
import TransactionListSkeleton from "./skeleton/TransactionListSkeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { FindTransactionsDto, Transaction } from "@/types/Transaction.type";
import { Category } from "@/types/Category.type";
import { useRouter } from "next/navigation";

interface TransactionListProps {
  data?: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ data }) => {
  const router = useRouter();
  // const transactions = data ?? [];
  const transactionStore = useTransactionStore();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const [loading, setLoading] = useState(true); // ✅ Loading state

  // Month & Year state
  const today = new Date();
  const [month, setMonth] = useState<string>(String(today.getMonth() + 1));
  const [year, setYear] = useState<string>(String(today.getFullYear()));

  const getMonthStartAndEndDates = (monthStr: string, yearStr: string) => {
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      throw new Error("Invalid month or year");
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const pad = (n: number) => (n < 10 ? "0" + n : n);

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const getAll = async (monthParam: string, yearParam: string) => {
    setLoading(true);
    const dates = getMonthStartAndEndDates(monthParam, yearParam);
    const query: FindTransactionsDto = {
      startDate: dates.startDate,
      endDate: dates.endDate,
      limit: 100,
    };

    await transactionStore.getAllTransactions(query);
    setLoading(false);
  };

  useEffect(() => {
    getAll(month, year);
  }, []);

  const handleDoubleClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setShowEditDialog(true);
  };

  const handleMonthChange = async (val: string) => {
    setMonth(val);
    await getAll(val, year);
  };

  const handleYearChange = async (val: string) => {
    setYear(val);
    await getAll(month, val);
  };

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = today.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

  return (
    <Card className="w-full bg-card/60 backdrop-blur-md border border-border shadow-md rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-lg font-bold">
            Monthly Transactions
          </CardTitle>
          <div className="flex gap-2">
            <Select value={month} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={year} onValueChange={handleYearChange}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-sm text-foreground/60">
          Showing the last 100 transactions for{" "}
          {months.find((m) => m.value === month)?.label}, {year}.{" "}
          <div
            className=" cursor-pointer"
            onClick={() => router.push("/finance/transaction-explorer")}
          >
            Want more details? Go to{" "}
            <span className="text-primary font-bold">
              {" "}
              Transaction Explorer.
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <TransactionListSkeleton /> // ✅ Skeleton while loading
        ) : transactionStore.transactions.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] text-sm text-foreground/70">
            No transactions found.
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full">
            <ul className="divide-y divide-border">
              {transactionStore.transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between items-center px-4 py-3 hover:bg-white/10 transition-colors rounded-md cursor-pointer"
                  onClick={() => handleDoubleClick(tx)}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {tx.category?.displayName}
                    </span>
                    <span className="text-xs text-foreground/70">
                      {format(tx.date, "MMMM d, yyyy")}{" "}
                      {tx.description && `• ${tx.description}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        tx.type === "income" ? "secondary" : "destructive"
                      }
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
        )}
      </CardContent>

      <TransactionModal
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        transaction={selectedTransaction}
      />
    </Card>
  );
};

export default TransactionList;
