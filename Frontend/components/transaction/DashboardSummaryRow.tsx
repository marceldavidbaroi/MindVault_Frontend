"use client";

import React from "react";
import SummaryCard from "./SummaryCard";
import { useSummaryStore } from "@/store/summaryStore";

const DashboardSummaryRow = () => {
  const summaryStore = useSummaryStore();

  const data = summaryStore.tdComparison;

  if (!data) return null; // show nothing if no data

  return (
    <div className="flex gap-4  ">
      {/* Daily */}
      <SummaryCard
        title="Daily"
        currency="$"
        current={{
          totalIncome: data.daily.today.totalIncome,
          totalExpense: data.daily.today.totalExpense,
        }}
        previous={{
          totalIncome: data.daily.yesterday.totalIncome,
          totalExpense: data.daily.yesterday.totalExpense,
        }}
      />

      {/* Weekly */}
      <SummaryCard
        title="Weekly"
        currency="$"
        current={{
          totalIncome: data.weekly.thisWeek.totalIncome,
          totalExpense: data.weekly.thisWeek.totalExpense,
        }}
        previous={{
          totalIncome: data.weekly.lastWeek.totalIncome,
          totalExpense: data.weekly.lastWeek.totalExpense,
        }}
      />

      {/* Monthly */}
      <SummaryCard
        title="Monthly"
        currency="$"
        current={{
          totalIncome: data.monthly.thisMonth.totalIncome,
          totalExpense: data.monthly.thisMonth.totalExpense,
        }}
        previous={{
          totalIncome: data.monthly.lastMonth.totalIncome,
          totalExpense: data.monthly.lastMonth.totalExpense,
        }}
      />

      {/* Yearly */}
      <SummaryCard
        title="Yearly"
        currency="$"
        current={{
          totalIncome: data.yearly.thisYear.totalIncome,
          totalExpense: data.yearly.thisYear.totalExpense,
        }}
        previous={{
          totalIncome: data.yearly.lastYear.totalIncome,
          totalExpense: data.yearly.lastYear.totalExpense,
        }}
      />
    </div>
  );
};

export default DashboardSummaryRow;
