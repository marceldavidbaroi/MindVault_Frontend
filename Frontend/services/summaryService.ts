import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";

export const summaryService = {
  transaction_dashboard: () =>
    fetcher<any>(ENDPOINTS.summary.transactionDashboard, {
      method: "GET",
    }),
};
