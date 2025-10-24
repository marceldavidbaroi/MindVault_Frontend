import TransactionIndex from "@/components/transaction/TransactionIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/ApiResponse.type";
import { Category } from "@/types/Category.type";
import { cookies } from "next/headers";
import React from "react";

const TransactionPage = async () => {
  // ✅ Await cookies() to handle both sync & async runtime safely
  const cookieStore = await cookies();

  // ✅ Construct cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // ✅ Fetch dashboard data with cookies forwarded
  const { data } = await fetcher(ENDPOINTS.summary.transactionDashboard, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const categories: ApiResponse<Category[]> = await fetcher(
    ENDPOINTS.category.all,
    {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  return <TransactionIndex data={data} categoriesData={categories?.data} />;
};

export default TransactionPage;
