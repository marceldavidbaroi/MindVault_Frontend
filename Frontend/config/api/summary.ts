export const SUMMARY_ENDPOINTS = {
  dashboard_comparison: (accountId: number | string) =>
    `/summaries/${accountId}/comparison`,
  dailyCategorySummary: (accountId: number) =>
    `/category-summaries/${accountId}/daily`,
  monthlyCategorySummary: (accountId: number) =>
    `/category-summaries/${accountId}/monthly`,
  dailySummary: {
    get: (accountId: number) => `/daily-summaries/${accountId}`,
    comparison: (accountId: number) =>
      `/daily-summaries/${accountId}/comparison`,
    lastNDays: (accountId: number) =>
      `/daily-summaries/${accountId}/last-n-days`,
  },
  weeklySummary: {
    get: (accountId: number) => `/weekly-summaries/${accountId}`,
    comparison: (accountId: number) =>
      `/weekly-summaries/${accountId}/comparison`,
    lastNWeeks: (accountId: number) =>
      `/weekly-summaries/${accountId}/last-n-weeks`,
  },
  monthlySummary: {
    get: (accountId: number) => `/monthly-summaries/${accountId}`,
    comparison: (accountId: number) =>
      `/monthly-summaries/${accountId}/comparison`,
    lastNMonths: (accountId: number) =>
      `/monthly-summaries/${accountId}/last-n-months`,
  },
  yearlySummary: {
    get: (accountId: number) => `/yearly-summaries/${accountId}`,
    comparison: (accountId: number) =>
      `/yearly-summaries/${accountId}/comparison`,
    lastNYears: (accountId: number) =>
      `/yearly-summaries/${accountId}/last-n-years`,
  },
  trendInsights: {
    trend: (accountId: number) => `/trend-insights/${accountId}/trend`,
    topCategories: (accountId: number) =>
      `/trend-insights/${accountId}/top-categories`,
  },
};
