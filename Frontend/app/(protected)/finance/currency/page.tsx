import CurrencyIndex from "@/components/currency/CurrencyIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/ApiResponse.type";
import { cookies } from "next/headers";

const currencyPage = async () => {
  const cookieStore = await cookies();

  // ✅ Construct cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const currencies: ApiResponse<any> = await fetcher(ENDPOINTS.currency.get, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });
  return (
    <div>
      <CurrencyIndex currencies={currencies.data} />
    </div>
  );
};

export default currencyPage;
