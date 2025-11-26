"use client";

import React, { useState, useEffect } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// Helper to get Tailwind color from class
const getTailwindColor = (className: string) => {
  if (typeof window === "undefined") return "#000";
  const el = document.createElement("div");
  el.className = className;
  el.style.display = "none";
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  document.body.removeChild(el);
  return color;
};

export default function CustomRangePage() {
  const accountStore = useAccountStore();
  const summaryStore = useSummaryStore();

  const [rangeType, setRangeType] = useState<"day" | "week" | "month" | "year">(
    "day"
  );
  const [n, setN] = useState(2);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<"chart" | "report">("chart");
  const [incomeColor, setIncomeColor] = useState("#82ca9d");
  const [expenseColor, setExpenseColor] = useState("#ff7f50");

  // Initialize chart colors from Tailwind classes
  useEffect(() => {
    setIncomeColor(getTailwindColor("text-chart-1"));
    setExpenseColor(getTailwindColor("text-chart-2"));
  }, []);

  const generate = async () => {
    if (!accountStore.selectedAccountId || n <= 0) return;
    setLoading(true);
    const accountId = Number(accountStore.selectedAccountId);

    try {
      switch (rangeType) {
        case "day":
          await summaryStore.getLastNDays(accountId, { n });
          break;
        case "week":
          await summaryStore.getLastNWeeks(accountId, { n });
          break;
        case "month":
          await summaryStore.getLastNMonths(accountId, { n });
          break;
        case "year":
          await summaryStore.getLastNYears(accountId, { n });
          break;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart and report data
  let chartData: { name: string; income: number; expense: number }[] = [];
  let reportData: any[] = [];

  switch (rangeType) {
    case "day":
      reportData = summaryStore.lastNDays || [];
      chartData = reportData.map((d) => ({
        name: d.date,
        income: Number(d.totalIncome),
        expense: Number(d.totalExpense),
      }));
      break;
    case "week":
      reportData = summaryStore.lastNWeeks || [];
      chartData = reportData.map((d) => ({
        name: d.weekStart,
        income: Number(d.summary?.totalIncome || 0),
        expense: Number(d.summary?.totalExpense || 0),
      }));
      break;
    case "month":
      reportData = summaryStore.lastNMonths || [];
      chartData = reportData.map((d) => ({
        name: `${d.month}/${d.year}`,
        income: Number(d.summary?.totalIncome || 0),
        expense: Number(d.summary?.totalExpense || 0),
      }));
      break;
    case "year":
      reportData = summaryStore.lastNYears || [];
      chartData = reportData.map((d) => ({
        name: `${d.year}`,
        income: Number(d.summary?.totalIncome || 0),
        expense: Number(d.summary?.totalExpense || 0),
      }));
      break;
  }

  const money = (n?: string | number) =>
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-6 mx-auto max-w-4xl">
      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <AccountsList mode="mini" enableRedirect={false} />

        <Select value={rangeType} onValueChange={(v) => setRangeType(v as any)}>
          <SelectTrigger className="w-[120px] bg-white border-gray-300">
            <SelectValue placeholder="Range Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={n}
          min={1}
          onChange={(e) => setN(Number(e.target.value))}
          placeholder="Number"
          className="w-[100px]"
        />

        <Select value={viewType} onValueChange={(v) => setViewType(v as any)}>
          <SelectTrigger className="w-[120px] bg-white border-gray-300">
            <SelectValue placeholder="View Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chart">Chart View</SelectItem>
            <SelectItem value="report">Report View</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={generate}
          disabled={!accountStore.selectedAccountId || loading || n <= 0}
          className="px-6 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "Generate"}
        </Button>
      </div>

      {/* MAIN DISPLAY */}
      {viewType === "chart" ? (
        <div className="bg-white/20 backdrop-blur-md p-6 border border-white/40 shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold border-b pb-3 tracking-tight mb-4">
            Last {n} {rangeType}
            {n > 1 ? "s" : ""} Summary
          </h1>
          {chartData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No data to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={incomeColor} />
                  ))}
                </Bar>
                <Bar dataKey="expense">
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={expenseColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-lg">
          <h1 className="text-2xl font-semibold border-b pb-3 tracking-tight mb-4">
            Last {n} {rangeType}
            {n > 1 ? "s" : ""} Report
          </h1>
          {reportData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No data to display
            </div>
          ) : (
            <div className="space-y-6">
              {reportData.map((item, index) => {
                const income = Number(
                  item.summary?.totalIncome ?? item.totalIncome ?? 0
                );
                const expense = Number(
                  item.summary?.totalExpense ?? item.totalExpense ?? 0
                );
                const prevIncome =
                  index > 0
                    ? Number(
                        reportData[index - 1].summary?.totalIncome ??
                          reportData[index - 1].totalIncome ??
                          0
                      )
                    : 0;
                const prevExpense =
                  index > 0
                    ? Number(
                        reportData[index - 1].summary?.totalExpense ??
                          reportData[index - 1].totalExpense ??
                          0
                      )
                    : 0;

                const diffIncome = income - prevIncome;
                const diffExpense = expense - prevExpense;

                const label =
                  item.date ||
                  item.weekStart ||
                  (item.month && item.year
                    ? `${item.month}/${item.year}`
                    : item.year);

                return (
                  <section key={index}>
                    <h2 className="text-lg font-semibold border-l-4 border-gray-900 pl-3 mb-4">
                      {label}
                    </h2>
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 text-gray-600">Income</td>
                          <td
                            className={`py-2 text-right font-mono font-bold flex items-center justify-end gap-1 text-chart-1`}
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
                            className={`py-2 text-right font-mono font-bold flex items-center justify-end gap-1 text-chart-2`}
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
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
