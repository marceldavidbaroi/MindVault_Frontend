"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

interface SummaryData {
  total: number;
  income: {
    total: number;
    system: number;
    user: number;
  };
  expense: {
    total: number;
    system: number;
    user: number;
  };
}

const CategoryStatusCard = ({ data }: { data: SummaryData }) => {
  return (
    <div
      className="
        flex flex-col gap-4
        sm:flex-row sm:flex-wrap sm:justify-between
        lg:flex-col
      "
    >
      {/* Total */}
      <Card className="bg-card text-card-foreground border border-border shadow hover:shadow-md transition-all flex-1 min-w-[220px]">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-primary flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Total Transaction Categories
          </CardTitle>
          <span className="text-xl font-bold">{data.total}</span>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Combined income & expense activity
        </CardContent>
      </Card>

      {/* Income */}
      <Card className="bg-primary/10 text-primary border border-primary/30 shadow hover:shadow-md transition-all flex-1 min-w-[220px]">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ArrowUp className="h-5 w-5" />
            Income
          </CardTitle>
          <span className="text-xl font-bold">{data.income.total}</span>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>System</span>
            <span className="font-medium">{data.income.system}</span>
          </div>
          <div className="flex justify-between">
            <span>User</span>
            <span className="font-medium">{data.income.user}</span>
          </div>
        </CardContent>
      </Card>

      {/* Expense */}
      <Card className="bg-destructive/10 text-destructive border border-destructive/30 shadow hover:shadow-md transition-all flex-1 min-w-[220px]">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            Expense
          </CardTitle>
          <span className="text-xl font-bold">{data.expense.total}</span>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>System</span>
            <span className="font-medium">{data.expense.system}</span>
          </div>
          <div className="flex justify-between">
            <span>User</span>
            <span className="font-medium">{data.expense.user}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryStatusCard;
