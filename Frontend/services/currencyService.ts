import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";
import { Currency } from "@/types/Currency.type";
import { ApiResponse } from "@/types/ApiResponse.type";

export const currencyService = {
  /** GET all supported currencies */
  getAll: () =>
    fetcher<ApiResponse<Currency[]>>(ENDPOINTS.currency.get, {
      method: "GET",
    }),
};
