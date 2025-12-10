import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";
import { Currency } from "@/types/Currency.type";
import { ApiResponse } from "@/types/ApiResponse.type";

export const currencyService = {
  /** GET all supported currencies */
  getAll: () =>
    fetcher<ApiResponse<Currency[]>>(API_ENDPOINTS.currency.get, {
      method: "GET",
    }),
};
