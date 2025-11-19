"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSummaryStore } from "@/store/summaryStore";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAccountStore } from "@/store/accountStore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const todayStr = format(new Date(), "yyyy-MM-dd");

export default function CategorySummaryChart() {
  const summaryStore = useSummaryStore();
  const accountStore = useAccountStore();

  const [view, setView] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Colors stored safely to avoid SSR errors
  const [incomeColor, setIncomeColor] = useState("#4ade80"); // fallback
  const [expenseColor, setExpenseColor] = useState("#f97316"); // fallback

  // ⭐ Load CSS colors on client only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = getComputedStyle(document.documentElement);

    setIncomeColor(
      root.getPropertyValue("--color-chart-4").trim() || "#4ade80"
    );
    setExpenseColor(
      root.getPropertyValue("--color-chart-2").trim() || "#f97316"
    );
  }, []);

  // ⭐ Fetch DAILY or MONTHLY summary
  useEffect(() => {
    if (view === "daily") {
      summaryStore.getDailyCategorySummary(
        Number(accountStore.selectedAccountId),
        { date: String(selectedDate) }
      );
    } else {
      summaryStore.getMonthlyCategorySummary(
        Number(accountStore.selectedAccountId),
        { month: Number(selectedMonth), year: Number(selectedYear) }
      );
    }
  }, [view, selectedDate, selectedMonth, selectedYear]);

  // ⭐ Prepare chart data (SSR-safe)
  const chartData = useMemo(() => {
    const data =
      view === "daily"
        ? summaryStore.dailyCategorySummary || []
        : summaryStore.monthlyCategorySummary || [];

    return {
      labels: data.map((d) => d.displayName),
      datasets: [
        {
          label: "Income / Expense",
          data: data.map((d) => d.totalAmount),
          backgroundColor: data.map((d) =>
            d.type === "income" ? incomeColor : expenseColor
          ),
          borderRadius: 8,
          barThickness: 24,
        },
      ],
    };
  }, [
    view,
    summaryStore.dailyCategorySummary,
    summaryStore.monthlyCategorySummary,
    incomeColor,
    expenseColor,
  ]);

  return (
    <div className="w-full h-full p-4 md:p-6 bg-background/50 backdrop-blur-md rounded-xl border border-white/20 shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 flex-shrink-0">
        {/* Toggle */}
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={view === "daily" ? "default" : "outline"}
            onClick={() => setView("daily")}
          >
            Daily
          </Button>
          <Button
            size="sm"
            variant={view === "monthly" ? "default" : "outline"}
            onClick={() => setView("monthly")}
          >
            Monthly
          </Button>
        </div>

        {/* Date / Month Picker */}
        {view === "daily" ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                {selectedDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="scale-90 origin-top">
                <Calendar
                  mode="single"
                  selected={new Date(selectedDate)}
                  onSelect={(date) =>
                    date && setSelectedDate(format(date, "yyyy-MM-dd"))
                  }
                />
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex space-x-2">
            <select
              className="border rounded-md px-2 py-1 bg-background text-foreground"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <select
              className="border rounded-md px-2 py-1 bg-background text-foreground"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={selectedYear - 2 + i}>
                  {selectedYear - 2 + i}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="w-full flex-1 overflow-x-auto">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.parsed.y || context.parsed.x}`,
                },
              },
            },
            indexAxis: "y",
            scales: {
              x: { beginAtZero: true },
              y: { ticks: { font: { size: 14 } } },
            },
          }}
          height={400}
        />
      </div>
    </div>
  );
}
