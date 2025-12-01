import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SummaryCardProps {
  title: string;
  currency?: string;
  current: {
    totalIncome: string;
    totalExpense: string;
  };
  previous: {
    totalIncome: string;
    totalExpense: string;
  };
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  currency,
  current,
  previous,
}) => {
  return (
    <div
      className="flex flex-col justify-between py-2 px-4 rounded-xl shadow-md w-[250px] h-full
                 backdrop-blur-md border border-gray-200/20"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Frosted glass effect
        color: "var(--card-foreground)",
      }}
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="flex justify-between">
        {/* Current */}
        <div className="flex flex-col gap-2">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Current
          </p>
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" style={{ color: "var(--chart-5)" }} />
            <p className="text-md font-bold ">
              {currency} {current.totalIncome}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDown
              className="w-4 h-4"
              style={{ color: "var(--primary)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--primary)" }}
            >
              {currency} {current.totalExpense}
            </p>
          </div>
        </div>

        {/* Previous */}
        <div className="flex flex-col gap-2">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Previous
          </p>
          <div className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" style={{ color: "var(--chart-5)" }} />
            <p className="text-md font-bold">
              {currency} {previous.totalIncome}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDown
              className="w-4 h-4"
              style={{ color: "var(--primary)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--primary)" }}
            >
              {currency} {previous.totalExpense}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
