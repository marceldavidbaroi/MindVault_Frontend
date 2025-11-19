import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";

const toQueryString = (params: Record<string, any>) =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

export const summaryService = {
  transaction_dashboard_comparison: (id: number) =>
    fetcher<any>(ENDPOINTS.summary.dashboard_comparison(id), {
      method: "GET",
    }),

  dailyCategorySummary: (id: number, params: Record<string, any>) => {
    const query = toQueryString(params);
    return fetcher<any>(
      `${ENDPOINTS.summary.dailyCategorySummary(id)}?${query}`,
      {
        method: "GET",
      }
    );
  },

  monthlyCategorySummary: (id: number, params: Record<string, any>) => {
    const query = toQueryString(params);
    return fetcher<any>(
      `${ENDPOINTS.summary.monthlyCategorySummary(id)}?${query}`,
      {
        method: "GET",
      }
    );
  },
};
