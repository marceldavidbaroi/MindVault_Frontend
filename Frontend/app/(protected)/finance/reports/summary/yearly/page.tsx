"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function YearlyPage() {
  const summaryStore = useSummaryStore();
  const accountStore = useAccountStore();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!accountStore.selectedAccountId) return;

    setLoading(true);

    await summaryStore.getYearlyComparison(
      Number(accountStore.selectedAccountId),
      { year }
    );

    setLoading(false);
  };

  useEffect(() => {
    if (accountStore.selectedAccountId) generate();
  }, []);

  const comparison = summaryStore.yearlyComparison;
  const current = comparison?.thisYear;
  const previous = comparison?.lastYear;

  const diffIncome =
    current && previous
      ? Number(current.totalIncome) - Number(previous.totalIncome)
      : 0;

  const diffExpense =
    current && previous
      ? Number(current.totalExpense) - Number(previous.totalExpense)
      : 0;

  const money = (n?: number | string) =>
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="p-6 mx-auto max-w-4xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <AccountsList mode="mini" enableRedirect={false} />

        {/* YEAR SELECT */}
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-[150px] bg-white border-gray-300">
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

        {/* GENERATE BUTTON */}
        <Button
          onClick={generate}
          disabled={!accountStore.selectedAccountId || loading}
          className="px-6 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {/* PAPER REPORT */}
      <div className="mt-10 bg-white p-8 border border-gray-300 shadow-sm">
        <h1 className="text-2xl font-semibold border-b pb-3 tracking-tight">
          Yearly Financial Report
        </h1>

        <p className="text-sm text-gray-600 mt-1">{year}</p>

        {!current ? (
          <div className="text-center text-gray-500 py-10">
            No data to display
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {/* THIS YEAR */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                This Year
              </h2>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-gray-600">Income</td>
                    <td className="py-2 text-right font-mono font-bold text-chart-1">
                      {money(current.totalIncome)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Expense</td>
                    <td className="py-2 text-right font-mono font-bold text-chart-2">
                      {money(current.totalExpense)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* LAST YEAR */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                Last Year
              </h2>

              {!previous ? (
                <p className="text-gray-500 text-sm">No data available</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 text-gray-600">Income</td>
                      <td className="py-2 text-right font-mono font-bold text-chart-1">
                        {money(previous.totalIncome)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Expense</td>
                      <td className="py-2 text-right font-mono font-bold text-chart-2">
                        {money(previous.totalExpense)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </section>

            {/* DIFFERENCE */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                Differences (vs Last Year)
              </h2>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-gray-600">Income</td>
                    <td
                      className={cn(
                        "py-2 text-right font-mono font-bold",
                        diffIncome >= 0 ? "text-chart-1" : "text-chart-2"
                      )}
                    >
                      {money(diffIncome)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 text-gray-600">Expense</td>
                    <td
                      className={cn(
                        "py-2 text-right font-mono font-bold",
                        diffExpense >= 0 ? "text-chart-2" : "text-chart-1"
                      )}
                    >
                      {money(diffExpense)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
