"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function DailyPage() {
  const summaryStore = useSummaryStore();
  const accountStore = useAccountStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!accountStore.selectedAccountId) return;

    setLoading(true);

    // ❗ Only ONE API call now
    await summaryStore.getDailyComparison(
      Number(accountStore.selectedAccountId),
      {
        date: format(selectedDate, "yyyy-MM-dd"),
      }
    );

    setLoading(false);
  };

  useEffect(() => {
    if (accountStore.selectedAccountId) generate();
  }, []);

  // Extract from comparison API
  const comparison = summaryStore.dailyComparison;
  const today = comparison?.today;
  const yesterday = comparison?.yesterday;

  const diffIncome =
    today && yesterday
      ? Number(today.totalIncome) - Number(yesterday.totalIncome)
      : 0;

  const diffExpense =
    today && yesterday
      ? Number(today.totalExpense) - Number(yesterday.totalExpense)
      : 0;

  const money = (n?: string | number) =>
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-6 mx-auto max-w-4xl">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <AccountsList mode="mini" enableRedirect={false} />

        {/* DATE PICKER */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal bg-white border-gray-300",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 bg-white border border-gray-300">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(v) => v && setSelectedDate(v)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

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
          Daily Financial Report
        </h1>

        <p className="text-sm text-gray-600 mt-1">
          {format(selectedDate, "PPPP")}
        </p>

        {!today ? (
          <div className="text-center text-gray-500 py-10">
            No data to display
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {/* SECTION: TODAY */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                Today
              </h2>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-gray-600">Income</td>
                    <td className="py-2 text-right font-mono font-bold text-chart-1">
                      {money(today.totalIncome)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 text-gray-600">Expense</td>
                    <td className="py-2 text-right font-mono font-bold text-chart-2">
                      {money(today.totalExpense)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* SECTION: YESTERDAY */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                Yesterday
              </h2>

              {yesterday ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2 text-gray-600">Income</td>
                      <td className="py-2 text-right font-mono font-bold text-chart-1">
                        {money(yesterday.totalIncome)}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-2 text-gray-600">Expense</td>
                      <td className="py-2 text-right font-mono font-bold text-chart-2">
                        {money(yesterday.totalExpense)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm">No data available</p>
              )}
            </section>

            {/* SECTION: DIFFERENCE */}
            <section>
              <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                Differences (vs Yesterday)
              </h2>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-gray-600">Income</td>
                    <td
                      className={cn(
                        "py-2 text-right font-mono font-bold flex items-center justify-end gap-1",
                        diffIncome >= 0 ? "text-chart-1" : "text-chart-2"
                      )}
                    >
                      {diffIncome >= 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      {money(diffIncome)}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 text-gray-600">Expense</td>
                    <td
                      className={cn(
                        "py-2 text-right font-mono font-bold flex items-center justify-end gap-1",
                        diffExpense >= 0 ? "text-chart-2" : "text-chart-1"
                      )}
                    >
                      {diffExpense >= 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
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
