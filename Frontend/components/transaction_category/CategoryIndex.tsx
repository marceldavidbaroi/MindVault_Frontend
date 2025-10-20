"use client";
import React, { useEffect } from "react";
import CategoryStatusCard from "./CategoryStatusCard";
import CategoryList from "./CategoryList";
import { useCategoryStore } from "@/store/categoryStore";

const CategoryIndex = ({ stats, categories }) => {
  const categoryStore = useCategoryStore();
  useEffect(() => {
    categoryStore.setCategories(categories);
  }, []);
  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[85vh] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4  p-4 overflow-auto">
        <CategoryStatusCard data={stats} />
      </div>

      {/* Content */}
      <div className="w-full lg:flex-1  p-4 overflow-auto">
        <CategoryList categories={categoryStore.categories} />
      </div>
    </div>
  );
};

export default CategoryIndex;
