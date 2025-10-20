import CategoryIndex from "@/components/transaction_category/CategoryIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/ApiResponse.type";
import { Category } from "@/types/Category.type";
import { Stats } from "framer-motion";
import { cookies } from "next/headers";
import React from "react";

const CategoryPage = async () => {
  const cookieStore = await cookies();

  // ✅ Construct cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const stats: ApiResponse<any> = await fetcher(ENDPOINTS.category.stats, {
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
  return (
    <div>
      <CategoryIndex
        stats={
          stats?.data ?? {
            total: 0,
            income: { total: 0, system: 0, user: 0 },
            expense: { total: 0, system: 0, user: 0 },
          }
        }
        categories={categories?.data ?? []}
      />
    </div>
  );
};

export default CategoryPage;
