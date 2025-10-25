export interface TransactionSummaryDashboard {
  recentTransactions: any[];
  summary: any[];
  totalRemainingIncomeAllTime: number;
  totalRemainingIncomeThisMonth: number;
  weekly: {
    totalSpending: number;
    breakdown: {
      day: string;
      amount: number;
    }[];
  };
}
