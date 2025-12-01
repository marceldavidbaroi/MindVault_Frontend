export interface DashboardComparison {
  daily: {
    today: DailySummary;
    yesterday: DailySummary;
  };
  weekly: {
    thisWeek: WeeklySummary;
    lastWeek: WeeklySummary;
  };
  monthly: {
    thisMonth: MonthlySummary;
    lastMonth: MonthlySummary;
  };
  yearly: {
    thisYear: YearlySummary;
    lastYear: YearlySummary;
  };
}

export interface DailySummary {
  id: number | null;
  date: string | null; // e.g., "2025-11-18"
  totalIncome: string; // can parseFloat if needed
  totalExpense: string;
}

export interface WeeklySummary {
  id: number | null;
  weekStart: string | null; // e.g., "2025-11-16"
  totalIncome: string;
  totalExpense: string;
}

export interface MonthlySummary {
  id: number | null;
  year: number | null;
  month: number | null; // 1-12
  totalIncome: string;
  totalExpense: string;
}

export interface YearlySummary {
  id: number | null;
  year: number | null;
  totalIncome: string;
  totalExpense: string;
}

export interface DailyCategorySummaryDto {
  date: string;
}
export interface MonthlyCategorySummaryDto {
  month: number;
  year: number;
}

export interface CategorySummaryItem {
  type: "income" | "expense";
  categoryId: number;
  displayName: string;
  totalAmount: string;
}
