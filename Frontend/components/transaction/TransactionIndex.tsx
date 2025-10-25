"use client";

import React, { useEffect, useState } from "react";
import FinancialSummaryCard from "@/components/transaction/FinancialSummaryCard";
import TransactionTableMini from "@/components/transaction/TransactionTableMini";
import WeeklySpendingCard from "@/components/transaction/WeeklySpendingCard";
import FinancialSummaryCardSkeleton from "./skeleton/FinancialSummaryCardSkeleton";
import WeeklySpendingCardSkeleton from "./skeleton/WeeklySpendingCardSkeleton";
import TransactionTableMiniSkeleton from "./skeleton/TransactionTableMiniSkeleton";
import { useSummaryStore } from "@/store/summaryStore";
import TransactionList from "./TransactionList";
import { useCategoryStore } from "@/store/categoryStore";
import { TransactionSummaryDashboard } from "@/types/Summary.type";
import { Category } from "@/types/Category.type";
interface TransactionIndexProps {
  data: TransactionSummaryDashboard;
  categoriesData: Category[];
}
const TransactionIndex: React.FC<TransactionIndexProps> = ({
  data,
  categoriesData,
}) => {
  const { transactionsDashboard, setTransactionDashboard } = useSummaryStore();
  const { categories, setCategories } = useCategoryStore();
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) setLoading(false);
  }, [data]);

  useEffect(() => {
    setTransactionDashboard(data);
    console.log("data", data);
  }, [data, setTransactionDashboard]);

  useEffect(() => {
    setCategories(categoriesData);
    console.log("category data", categoriesData);
  }, [categoriesData, setCategories]);

  useEffect(() => {
    console.log("Updated store:", transactionsDashboard);
  }, [transactionsDashboard]);
  useEffect(() => {
    console.log("Updated store:for categories", categoriesData);
  }, [categoriesData]);

  return (
    <div className="min-h-[70vh] p-4 bg-background text-foreground transition-colors duration-300">
      {/* Summary + Table Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* LEFT SIDE */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
          {/* Top row: Summary Cards */}
          <div
            className="
              flex overflow-x-auto px-2 py-2 gap-4 snap-x snap-mandatory
              scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent
              scrollbar-thumb-rounded-full
              hover:scrollbar-thumb-muted/80
              transition-colors duration-200
              [&::-webkit-scrollbar]:h-2
              [&::-webkit-scrollbar-track]:bg-muted/20
              [&::-webkit-scrollbar-thumb]:bg-muted
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-muted/80
            "
          >
            {transactionsDashboard.summary.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 snap-start min-w-[250px]"
                  >
                    <FinancialSummaryCardSkeleton />
                  </div>
                ))
              : transactionsDashboard.summary.map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 snap-start min-w-[250px]"
                  >
                    <FinancialSummaryCard data={item} />
                  </div>
                ))}
          </div>

          {/* Bottom: Transaction Table */}
          <div className="flex-1 overflow-auto  rounded-xl shadow-sm ">
            {loading ? (
              <TransactionTableMiniSkeleton />
            ) : (
              <TransactionTableMini
                data={transactionsDashboard.recentTransactions}
                onInfoClick={() => setShowList(!showList)}
              />
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
          {loading ? (
            <WeeklySpendingCardSkeleton />
          ) : (
            <WeeklySpendingCard
              totalRemainingIncomeAllTime={
                transactionsDashboard.totalRemainingIncomeAllTime
              }
              totalRemainingIncomeThisMonth={
                transactionsDashboard.totalRemainingIncomeThisMonth
              }
              weekly={transactionsDashboard.weekly}
            />
          )}
        </div>
      </div>
      {showList && (
        <div className="mt-6">
          <TransactionList />
        </div>
      )}
    </div>
  );
};

export default TransactionIndex;
