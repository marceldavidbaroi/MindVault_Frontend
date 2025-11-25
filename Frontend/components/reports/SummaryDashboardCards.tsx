"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CalendarRange,
  BarChart3,
  LineChart,
  CalendarCheck,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Daily Summary",
    description: "View income & expenses for a single day.",
    icon: Calendar,
    href: "/finance/reports/summary/daily",
  },
  {
    title: "Weekly Summary",
    description: "Track weekly spending patterns & compare weeks.",
    icon: CalendarRange,
    href: "/finance/reports/summary/weekly",
  },
  {
    title: "Monthly Summary",
    description: "Monitor monthly budgets & analyze spending habits.",
    icon: BarChart3,
    href: "/finance/reports/summary/monthly",
  },
  {
    title: "Yearly Summary",
    description: "Review annual financial performance & growth.",
    icon: CalendarCheck,
    href: "/finance/reports/summary/yearly",
  },
  {
    title: "Trend Insights",
    description: "AI-powered spending trends & category analysis.",
    icon: TrendingUp,
    href: "/finance/reports/summary/trends",
  },
  {
    title: "Category Summary",
    description: "View spending breakdown by categories over time.",
    icon: PieChart,
    href: "/finance/reports/summary/category",
  },
  {
    title: "Last N Range",
    description:
      "Flexible summaries for custom N days, weeks, months or years.",
    icon: LineChart,
    href: "/finance/reports/summary/custom-range",
  },
];

export default function SummaryDashboardCards() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Card
              onClick={() => router.push(card.href)}
              className="
                cursor-pointer
                rounded-lg
                h-56
                flex
                items-center
                justify-center
                bg-white/10 dark:bg-white/5
                backdrop-blur-md
                border border-white/20 dark:border-white/10
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                hover:shadow-[0_6px_25px_rgba(0,0,0,0.12)]
                transition-all
              "
            >
              <CardContent className="flex flex-col items-center text-center gap-4 px-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-primary" />
                </div>

                <h3 className="text-base font-semibold tracking-tight">
                  {card.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-normal">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
