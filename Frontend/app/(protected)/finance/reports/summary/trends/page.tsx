"use client";

import React, { useState, useEffect } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useSummaryStore } from "@/store/summaryStore";
import { useAccountStore } from "@/store/accountStore";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["var(--chart-1)", "var(--chart-2)"];

const TrendsPage = () => {
  const accountStore = useAccountStore();
  const summaryStore = useSummaryStore();

  const [view, setView] = useState<"trend" | "topCategories">("trend");
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("weekly");
  const [n, setN] = useState(2);
  const [loading, setLoading] = useState(false);
  const [dateOrMonth, setDateOrMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const generate = async () => {
    if (!accountStore.selectedAccountId) return;
    setLoading(true);
    const accountId = Number(accountStore.selectedAccountId);

    try {
      if (view === "trend") {
        // Trend Insights (all periods)
        await summaryStore.getTrendInsights(accountId, { period, n });
      } else if (view === "topCategories") {
        // Top Categories (only daily/monthly)
        const topCatParams: any = { period };

        if (period === "daily") {
          topCatParams.dateOrMonth =
            dateOrMonth || new Date().toISOString().slice(0, 10);
          topCatParams.year = new Date(topCatParams.dateOrMonth).getFullYear();
        }

        if (period === "monthly") {
          topCatParams.dateOrMonth = dateOrMonth || new Date().getMonth() + 1;
          topCatParams.year = year;
        }

        await summaryStore.getTopCategories(accountId, topCatParams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountStore.selectedAccountId) generate();
  }, [accountStore.selectedAccountId, view, period, n, dateOrMonth, year]);

  const chartData =
    summaryStore.trendInsights?.map((item: any) => {
      const summary = item.summary || {};
      return {
        name:
          item.weekStart ||
          item.date ||
          (item.month && item.year ? `${item.month}/${item.year}` : item.year),
        income: Number(summary.totalIncome || 0),
        expense: Number(summary.totalExpense || 0),
      };
    }) || [];

  const topCategories = summaryStore.topCategories || [];

  const money = (n?: string | number) =>
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="p-6 mx-auto max-w-5xl space-y-6">
      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <AccountsList mode="mini" enableRedirect={false} />

        {/* Select view */}
        <Select value={view} onValueChange={(v) => setView(v as any)}>
          <SelectTrigger className="w-[160px] bg-white border-gray-300">
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trend">Trend Insights</SelectItem>
            <SelectItem value="topCategories">Top Categories</SelectItem>
          </SelectContent>
        </Select>

        {/* Period */}
        <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
          <SelectTrigger className="w-[120px] bg-white border-gray-300">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            {view === "trend" && (
              <>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </>
            )}
            {view === "topCategories" && (
              <>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        {/* Top Category Inputs */}
        {view === "topCategories" &&
          (period === "daily" || period === "monthly") && (
            <input
              type={period === "daily" ? "date" : "number"}
              value={dateOrMonth}
              onChange={(e) => setDateOrMonth(e.target.value)}
              className="w-[120px] border rounded px-2 py-1"
              placeholder={period === "daily" ? "YYYY-MM-DD" : "Month (1-12)"}
            />
          )}

        {view === "topCategories" && period === "monthly" && (
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-[100px] border rounded px-2 py-1"
            placeholder="Year"
          />
        )}

        {/* Trend Periods Input */}
        {view === "trend" && (
          <input
            type="number"
            value={n}
            min={1}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-[100px] border rounded px-2 py-1"
            placeholder="Periods"
          />
        )}

        <Button
          onClick={generate}
          disabled={
            !accountStore.selectedAccountId ||
            loading ||
            (view === "trend" && n <= 0)
          }
          className="px-6 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "Generate"}
        </Button>
      </div>

      {/* TREND CHART */}
      {view === "trend" && (
        <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Trend Insights</h2>
          {chartData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No data to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) =>
                    money(Array.isArray(value) ? value[0] : value)
                  }
                />
                <Legend />
                <Bar dataKey="income" fill={COLORS[0]} />
                <Bar dataKey="expense" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* TOP CATEGORIES */}
      {view === "topCategories" && (
        <div className="bg-white p-6 border border-gray-300 shadow-sm rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Top Categories</h2>
          {topCategories.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No data to display
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Category</th>
                  <th className="py-2 text-right">Type</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topCategories.map(
                  (cat: {
                    categoryId: React.Key | null | undefined;
                    displayName:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    type:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    totalAmount: string | number | undefined;
                  }) => (
                    <tr key={cat.categoryId}>
                      <td className="py-2">{cat.displayName}</td>
                      <td className="py-2 text-right">{cat.type}</td>
                      <td
                        className={`py-2 text-right font-bold ${
                          cat.type === "income"
                            ? "text-chart-1"
                            : "text-chart-2"
                        }`}
                      >
                        {money(cat.totalAmount)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendsPage;
