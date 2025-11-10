import { create } from "zustand";
import { currencyService } from "@/services/currencyService";
import { Currency } from "@/types/Currency.type";
import { ApiResponse } from "@/types/ApiResponse.type";
interface CurrencyState {
  currencies: Currency[];
  setCurrencies: (currencies: Currency[]) => void;
  getAllCurrencies: () => Promise<ApiResponse<Currency[]>>;
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  // --- State ---
  currencies: [],

  // --- Setters ---
  setCurrencies: (currencies) => set({ currencies }),

  // --- Actions ---
  getAllCurrencies: async () => {
    const res = await currencyService.getAll();
    if (res.success && res.data) {
      set({ currencies: res.data });
    }
    return res;
  },
}));
