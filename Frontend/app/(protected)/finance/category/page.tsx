import CategoryIndex from "@/components/transaction_category/CategoryIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";
import React from "react";

const CategoryPage = async () => {
  const cookieStore = await cookies();

  // ✅ Construct cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const stats = await fetcher(ENDPOINTS.category.stats, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const categories = await fetcher(ENDPOINTS.category.all, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });
  return (
    <div>
      CategoryPage
      <CategoryIndex stats={stats?.data} categories={categories.data} />
    </div>
  );
};

export default CategoryPage;
