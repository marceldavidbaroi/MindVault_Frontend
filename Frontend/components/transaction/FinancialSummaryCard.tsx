"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  CalendarDays,
} from "lucide-react";

interface SummaryData {
  title: string;
  type: "year" | "month" | "today";
  income: number;
  expense: number;
  prevIncome: number;
  prevExpense: number;
}

interface FinancialSummaryCardProps {
  data: SummaryData;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  data,
}) => {
  const { title, type, income, expense, prevIncome, prevExpense } = data;

  const incomeDiff = prevIncome
    ? ((income - prevIncome) / prevIncome) * 100
    : 0;
  const expenseDiff = prevExpense
    ? ((expense - prevExpense) / prevExpense) * 100
    : 0;

  const typeIcon = {
    year: (
      <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
    ),
    month: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />,
    today: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />,
  };

  return (
    <Card
      className="
        w-full min-w-[260px] sm:min-w-[280px] md:w-64 lg:w-72 xl:w-80
        min-h-[120px] sm:min-h-[130px] md:min-h-[120px] lg:min-h-[120px] xl:min-h-[130px]
        bg-card/60 backdrop-blur-md border border-border shadow-md rounded-xl
      "
    >
      <CardHeader className="flex justify-between items-center px-3 py-0 sm:px-4 sm:py-0 m-0">
        <CardTitle className="text-sm sm:text-sm md:text-base lg:text-lg font-bold text-foreground">
          {title}
        </CardTitle>
        {typeIcon[type]}
      </CardHeader>

      <CardContent className="flex flex-col gap-1 px-3 py-1 sm:px-4 sm:py-1">
        {/* Income Section */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-foreground/90">
            Income
          </p>
          <div className="relative w-full h-4 sm:h-5 bg-muted rounded-md">
            <div
              className="
                h-4 sm:h-5 
                bg-success 
                rounded-md 
                flex items-center justify-end 
                pr-1 sm:pr-2 
                text-primary font-bold text-[9px] sm:text-[10px] md:text-xs
              "
              style={{
                width: `${Math.min(
                  (income / Math.max(prevIncome, 1)) * 100,
                  100
                )}%`,
              }}
            >
              {income.toLocaleString()} ৳
            </div>
          </div>
          <p
            className={`text-[8px] sm:text-[9px] md:text-[10px] flex items-center gap-1 ${
              incomeDiff >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {incomeDiff >= 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(incomeDiff).toFixed(1)}% from prev
          </p>
        </div>

        {/* Expense Section */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-foreground/90">
            Expense
          </p>
          <div className="relative w-full h-4 sm:h-5 bg-muted rounded-md">
            <div
              className="
                h-4 sm:h-5 
                bg-destructive 
                rounded-md 
                flex items-center justify-end 
                pr-1 sm:pr-2 
                text-primary-foreground font-bold text-[9px] sm:text-[10px] md:text-xs
              "
              style={{
                width: `${Math.min(
                  (expense / Math.max(prevExpense, 1)) * 100,
                  100
                )}%`,
              }}
            >
              {expense.toLocaleString()} ৳
            </div>
          </div>
          <p
            className={`text-[8px] sm:text-[9px] md:text-[10px] flex items-center gap-1 ${
              expenseDiff >= 0 ? "text-destructive" : "text-success"
            }`}
          >
            {expenseDiff >= 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(expenseDiff).toFixed(1)}% from prev
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryCard;
