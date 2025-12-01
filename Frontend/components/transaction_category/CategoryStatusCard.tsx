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
      // CRITICAL: Ensure cards remain in a row and enable horizontal scrolling
      className="
        flex flex-row 
        justify-start 
        w-full 
        gap-3 
        overflow-x-auto 
        pb-2  /* Adds padding to prevent scrollbar from hiding content */
      "
    >
      {/* 1. Total Card - Densified */}
      <Card className="bg-card text-card-foreground border border-border shadow hover:shadow-md transition-all flex-1 min-w-[180px]">
        {/* Adjusted Header: Smaller padding and grouped title/icon */}
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Wallet className="h-4 w-4 text-foreground/70" />
            Total Categories
          </CardTitle>
          {/* Use text-foreground for the main total count */}
          <span className="text-2xl font-bold text-foreground">
            {data.total}
          </span>
        </CardHeader>
        {/* Removed CardContent completely to save maximum vertical space */}
      </Card>

      {/* 2. Income Card - Densified (Themed using primary) */}
      <Card className="bg-primary/10 text-primary border border-primary/30 shadow hover:shadow-md transition-all flex-1 min-w-[180px]">
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            {/* Using text-primary for the icon color */}
            <ArrowUp className="h-4 w-4 text-primary" />
            Income Categories
          </CardTitle>
          {/* Changed hardcoded green to text-primary */}
          <span className="text-2xl font-bold text-primary">
            {data.income.total}
          </span>
        </CardHeader>
        {/* Condensed Content: Using smaller text and tight padding */}
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-0">
          <div className="flex justify-between">
            <span>System</span>
            {/* Using text-primary for counts */}
            <span className="font-semibold text-primary">
              {data.income.system}
            </span>
          </div>
          <div className="flex justify-between">
            <span>User Defined</span>
            {/* Using text-primary for counts */}
            <span className="font-semibold text-primary">
              {data.income.user}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Expense Card - Densified (Themed using destructive) */}
      <Card className="bg-destructive/10 text-destructive border border-destructive/30 shadow hover:shadow-md transition-all flex-1 min-w-[180px]">
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            {/* Using text-destructive for the icon color */}
            <ArrowDown className="h-4 w-4 text-destructive" />
            Expense Categories
          </CardTitle>
          {/* Using text-destructive for the total count */}
          <span className="text-2xl font-bold text-destructive">
            {data.expense.total}
          </span>
        </CardHeader>
        {/* Condensed Content: Using smaller text and tight padding */}
        <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-0">
          <div className="flex justify-between">
            <span>System</span>
            {/* Using text-destructive for counts */}
            <span className="font-semibold text-destructive">
              {data.expense.system}
            </span>
          </div>
          <div className="flex justify-between">
            <span>User Defined</span>
            {/* Using text-destructive for counts */}
            <span className="font-semibold text-destructive">
              {data.expense.user}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryStatusCard;
