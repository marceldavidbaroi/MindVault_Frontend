import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";

const toQueryString = (params: Record<string, any>) =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

export const summaryService = {
  transaction_dashboard_comparison: (id: number) =>
    fetcher<any>(API_ENDPOINTS.summary.dashboard_comparison(id), {
      method: "GET",
    }),

  dailyCategorySummary: (id: number, params: Record<string, any>) => {
    const query = toQueryString(params);
    return fetcher<any>(
      `${API_ENDPOINTS.summary.dailyCategorySummary(id)}?${query}`,
      {
        method: "GET",
      }
    );
  },

  monthlyCategorySummary: (id: number, params: Record<string, any>) => {
    const query = toQueryString(params);
    return fetcher<any>(
      `${API_ENDPOINTS.summary.monthlyCategorySummary(id)}?${query}`,
      {
        method: "GET",
      }
    );
  },

  // --- Newly added APIs ---

  dailySummary: {
    get: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.dailySummary.get(id)}${query}`,
        {
          method: "GET",
        }
      );
    },
    comparison: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.dailySummary.comparison(id)}${query}`,
        { method: "GET" }
      );
    },
    lastNDays: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.dailySummary.lastNDays(id)}${query}`,
        { method: "GET" }
      );
    },
  },

  weeklySummary: {
    get: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.weeklySummary.get(id)}${query}`,
        {
          method: "GET",
        }
      );
    },
    comparison: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.weeklySummary.comparison(id)}${query}`,
        { method: "GET" }
      );
    },
    lastNWeeks: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.weeklySummary.lastNWeeks(id)}${query}`,
        { method: "GET" }
      );
    },
  },

  monthlySummary: {
    get: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.monthlySummary.get(id)}${query}`,
        { method: "GET" }
      );
    },
    comparison: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.monthlySummary.comparison(id)}${query}`,
        { method: "GET" }
      );
    },
    lastNMonths: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.monthlySummary.lastNMonths(id)}${query}`,
        { method: "GET" }
      );
    },
  },

  yearlySummary: {
    get: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.yearlySummary.get(id)}${query}`,
        { method: "GET" }
      );
    },
    comparison: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.yearlySummary.comparison(id)}${query}`,
        { method: "GET" }
      );
    },
    lastNYears: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.yearlySummary.lastNYears(id)}${query}`,
        { method: "GET" }
      );
    },
  },

  trendInsights: {
    trend: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.trendInsights.trend(id)}${query}`,
        { method: "GET" }
      );
    },
    topCategories: (id: number, params?: Record<string, any>) => {
      const query = params ? `?${toQueryString(params)}` : "";
      return fetcher<any>(
        `${API_ENDPOINTS.summary.trendInsights.topCategories(id)}${query}`,
        { method: "GET" }
      );
    },
  },
};
