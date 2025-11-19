"use client";

import React, { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const todayStr = format(new Date(), "yyyy-MM-dd");

export default function CategorySummaryChart() {
  const summaryStore = useSummaryStore();

  const [view, setView] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // derive chartData from store
  const chartData = React.useMemo(() => {
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
            d.type === "income" ? "#22c55e" : "#ef4444"
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
  ]);

  return (
    <div className="w-full p-4 md:p-6 bg-background/50 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h3 className="text-xl font-bold">Category Summary</h3>

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
              <Calendar
                mode="single"
                selected={new Date(selectedDate)}
                onSelect={(date) =>
                  date && setSelectedDate(format(date, "yyyy-MM-dd"))
                }
              />
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
      <div className="w-full overflow-x-auto">
        <Bar
          data={chartData}
          options={{
            responsive: true,
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
              x: { beginAtZero: true, ticks: { stepSize: 10 } },
              y: { ticks: { font: { size: 14 } } },
            },
          }}
        />
      </div>
    </div>
  );
}
