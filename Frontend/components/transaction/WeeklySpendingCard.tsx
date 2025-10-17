"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailySpending {
  day: string;
  amount: number;
}

interface WeeklyData {
  totalSpending: number;
  breakdown: DailySpending[];
}

interface WeeklySpendingProps {
  totalRemainingIncomeAllTime?: number;
  totalRemainingIncomeThisMonth?: number;
  weekly?: WeeklyData;
}

const WeeklySpendingCard: React.FC<WeeklySpendingProps> = ({
  totalRemainingIncomeAllTime = 0,
  totalRemainingIncomeThisMonth = 0,
  weekly = {
    totalSpending: 0,
    breakdown: [
      { day: "Mon", amount: 0 },
      { day: "Tue", amount: 0 },
      { day: "Wed", amount: 0 },
      { day: "Thu", amount: 0 },
      { day: "Fri", amount: 0 },
      { day: "Sat", amount: 0 },
      { day: "Sun", amount: 0 },
    ],
  },
}) => {
  const { totalSpending, breakdown } = weekly;

  return (
    <Card className="h-full w-full border border-border bg-card text-card-foreground shadow-md rounded-xl flex flex-col">
      {/* Top Section */}
      <CardHeader className="text-left pb-2">
        <CardTitle className="text-lg md:text-xl text-primary">
          Spend This Week
        </CardTitle>
        <CardDescription className="text-muted-foreground text-4xl font-bold mt-2">
          {totalSpending.toLocaleString()} ৳
        </CardDescription>
      </CardHeader>

      {/* Area Chart */}
      <CardContent className="flex-1 min-h-[200px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={breakdown}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="hsl(var(--border) / 0.3)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--popover-foreground))",
              }}
              labelStyle={{
                color: "hsl(var(--popover-foreground))",
              }}
              itemStyle={{
                color: "hsl(var(--primary))",
              }}
            />
            <Area
              type="natural"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.2)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>

      {/* Bottom Section */}
      <div className="mt-4 w-full flex flex-col gap-3 px-3 pb-4">
        <div className="h-12 bg-accent/20 rounded-lg flex items-center justify-between px-4">
          <span className="text-xl font-semibold text-foreground">
            {totalRemainingIncomeAllTime.toLocaleString()} ৳
          </span>
          <span className="text-muted-foreground text-sm">
            All Time Remaining
          </span>
        </div>
        <div className="h-12 bg-secondary/20 rounded-lg flex items-center justify-between px-4">
          <span className="text-xl font-semibold text-foreground">
            {totalRemainingIncomeThisMonth.toLocaleString()} ৳
          </span>
          <span className="text-muted-foreground text-sm">
            This Month Remaining
          </span>
        </div>
      </div>
    </Card>
  );
};

export default WeeklySpendingCard;
