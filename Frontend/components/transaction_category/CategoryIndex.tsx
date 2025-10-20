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
    <div className="flex flex-col lg:flex-row gap-4 h-[85vh] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4  p-4 overflow-auto">
        {categoryStore.categoryStats.total > 0 ? (
          <CategoryStatusCard data={categoryStore.categoryStats} />
        ) : (
          <CategoryStatusCardSkeleton />
        )}
      </div>

      {/* Content */}
      <div className="w-full lg:flex-1  p-4 overflow-auto">
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
