"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function MonthlyPage() {
  const summaryStore = useSummaryStore();
  const accountStore = useAccountStore();

  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!accountStore.selectedAccountId) return;

    setLoading(true);

    await summaryStore.getMonthlyComparison(
      Number(accountStore.selectedAccountId),
      {
        month,
        year,
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    if (accountStore.selectedAccountId) generate();
  }, []);

  const comparison = summaryStore.monthlyComparison;
  const current = comparison?.thisMonth;
  const previous = comparison?.lastMonth;

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

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="p-6 mx-auto max-w-4xl">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <AccountsList mode="mini" enableRedirect={false} />

        {/* MONTH SELECT */}
        <Select
          value={String(month)}
          onValueChange={(v) => setMonth(Number(v))}
        >
          <SelectTrigger className="w-[150px] bg-white border-gray-300">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={String(m.value)}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* YEAR SELECT */}
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-[120px] bg-white border-gray-300">
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

        {/* GENERATE */}
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
          Monthly Financial Report
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          {months[month - 1].label} {year}
        </p>

        {!current ? (
          <div className="text-center text-gray-500 py-10">
            No data to display
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {/* CURRENT MONTH */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                This Month
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

            {/* PREVIOUS MONTH */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                Previous Month
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
                Differences (vs Previous Month)
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
