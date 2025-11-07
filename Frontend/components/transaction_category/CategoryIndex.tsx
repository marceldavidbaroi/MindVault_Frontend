"use client";
import React, { useEffect } from "react";
import CategoryStatusCard from "./CategoryStatusCard";
import CategoryList from "./CategoryList";
import { useCategoryStore } from "@/store/categoryStore";
import CategoryStatusCardSkeleton from "./skeleton/CategoryStatusCardSkeleton";
import CategoryListSkeleton from "./skeleton/CategoryListSkeleton";
import { Category, CategoryStats } from "@/types/Category.type";
interface CategoryIndexProps {
  stats: CategoryStats;
  categories: Category[];
}

const CategoryIndex: React.FC<CategoryIndexProps> = ({ stats, categories }) => {
  const categoryStore = useCategoryStore();

  useEffect(() => {
    categoryStore.setCategories(categories);
    categoryStore.setCategoryStats(stats);
  }, [categories, stats]);

  return (
    // 1. Change the main container to 'flex-col' only (remove lg:flex-row)
    <div className="flex flex-col gap-4 h-[85vh] overflow-hidden p-4">
      {/* 2. Card Section: Top Center */}
      {/* Use flex-row and justify-center to center the card horizontally */}
      <div className="flex flex-row justify-center w-full">
        {categoryStore.categoryStats.total > 0 ? (
          // The card component itself should handle its max width if necessary
          <CategoryStatusCard data={categoryStore.categoryStats} />
        ) : (
          <CategoryStatusCardSkeleton />
        )}
      </div>

      {/* 3. List Section: Full Width Below */}
      {/* Use flex-1 and overflow-auto to make the list take up the remaining space and be scrollable */}
      <div className="w-full flex-1 overflow-auto">
        {categoryStore.categories.length > 0 ? (
          <CategoryList categories={categoryStore.categories ?? []} />
        ) : (
          <CategoryListSkeleton />
        )}{" "}
      </div>
    </div>
  );
};

export default CategoryIndex;
