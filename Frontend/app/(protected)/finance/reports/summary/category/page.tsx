"use client";

import React, { useEffect, useState } from "react";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import { useSummaryStore } from "@/store/summaryStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00bfff",
  "#ff69b4",
  "#8a2be2",
  "#ffa500",
];

export default function CategorySummaryPage() {
  const summaryStore = useSummaryStore();
  const accountStore = useAccountStore();
  const now = new Date();

  const [mode, setMode] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [date, setDate] = useState(format(now, "yyyy-MM-dd"));
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!accountStore.selectedAccountId) return;
    setLoading(true);

    if (mode === "daily") {
      await summaryStore.getDailyCategorySummary(
        Number(accountStore.selectedAccountId),
        { date }
      );
    } else {
      await summaryStore.getMonthlyCategorySummary(
        Number(accountStore.selectedAccountId),
        { month, year }
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    if (accountStore.selectedAccountId) generate();
  }, [accountStore.selectedAccountId, mode, date, month, year]);

  const data =
    mode === "daily"
      ? summaryStore.dailyCategorySummary
      : summaryStore.monthlyCategorySummary;
  const chartData =
    data?.map((d) => ({ name: d.displayName, value: Number(d.totalAmount) })) ||
    [];

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

  const handleDateChange = (d: Date | undefined) => {
    if (!d) return;
    setSelectedDate(d);
    setDate(format(d, "yyyy-MM-dd"));
  };

  return (
    <div className="p-6 mx-auto max-w-5xl">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <AccountsList mode="mini" enableRedirect={false} />

        {/* Mode Select */}
        <Select
          value={mode}
          onValueChange={(v) => setMode(v as "daily" | "monthly")}
        >
          <SelectTrigger className="w-[120px] bg-white border-gray-300">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>

        {/* Date / Month-Year Select */}
        {mode === "daily" ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start border-gray-300 bg-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <>
            <Select
              value={String(month)}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger className="w-[120px] bg-white border-gray-300">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="w-[100px] bg-white border-gray-300">
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
          </>
        )}

        <Button
          onClick={generate}
          disabled={!accountStore.selectedAccountId || loading}
          className="px-6 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
        >
          {loading ? "Loading..." : "Generate"}
        </Button>
      </div>

      {/* Donut Chart with Glass Effect */}
      <div className="bg-white/30 backdrop-blur-md p-6 border border-white/40 shadow-sm rounded-lg">
        <h1 className="text-2xl font-semibold border-b pb-3 tracking-tight">
          Category Summary (
          {mode === "daily" ? date : `${months[month - 1].label} ${year}`})
        </h1>

        {chartData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No data to display
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={480}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={120} // donut hole
                outerRadius={200}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
