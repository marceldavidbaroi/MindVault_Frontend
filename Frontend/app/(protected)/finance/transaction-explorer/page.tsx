import TransactionExplorerIndex from "@/components/transaction/TransactionExplorerIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/ApiResponse.type";
import { Category } from "@/types/Category.type";
import { cookies } from "next/headers";
import React from "react";

const TransactionExplorerPage = async () => {
  const cookieStore = await cookies();

  // ✅ Construct cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
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
  return (
    <>
      <TransactionExplorerIndex categories={categories.data} />
    </>
  );
};

export default TransactionExplorerPage;
