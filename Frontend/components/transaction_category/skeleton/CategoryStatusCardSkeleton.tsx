"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CategoryStatusCardSkeleton = () => {
  const renderSkeletonCard = () => (
    // Total Card Skeleton (Dense - No detailed content)
    <Card className="bg-card border border-border shadow flex-1 min-w-[180px] animate-pulse">
      {/* Matching dense header style (p-3) */}
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        {/* Placeholder for Title (Total Categories) */}
        <div className="h-4 w-24 bg-gray-300 rounded-sm" />
        {/* Placeholder for Value (Total Count) */}
        <div className="h-6 w-10 bg-gray-300 rounded-sm" />
      </CardHeader>
      {/* Note: CardContent is removed to match the density of the actual Total Card */}
    </Card>
  );

  const renderSkeletonCardWithDetails = () => (
    // Income/Expense Card Skeleton (Dense - with two detail lines)
    <Card className="flex-1 min-w-[180px] border border-border shadow animate-pulse">
      {/* Matching dense header style (p-3) */}
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        {/* Placeholder for Title (Income/Expense Categories) */}
        <div className="h-4 w-24 bg-gray-300 rounded-sm" />
        {/* Placeholder for Value (Income/Expense Total) */}
        <div className="h-6 w-10 bg-gray-300 rounded-sm" />
      </CardHeader>
      {/* Matching dense content style (p-3 pt-0, small text/gap) */}
      <CardContent className="p-3 pt-0 space-y-1">
        {/* Detail Line 1 (System) */}
        <div className="flex justify-between">
          <div className="h-3 w-12 bg-gray-200 rounded-sm" />
          <div className="h-3 w-8 bg-gray-200 rounded-sm" />
        </div>
        {/* Detail Line 2 (User Defined) */}
        <div className="flex justify-between">
          <div className="h-3 w-14 bg-gray-200 rounded-sm" />
          <div className="h-3 w-8 bg-gray-200 rounded-sm" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div
      // Enforce horizontal row, allow overflow-x-auto, and use gap-3
      className="flex flex-row justify-start w-full gap-3 overflow-x-auto pb-2"
    >
      {renderSkeletonCard()} {/* Total */}
      {renderSkeletonCardWithDetails()} {/* Income */}
      {renderSkeletonCardWithDetails()} {/* Expense */}
    </div>
  );
};

export default CategoryStatusCardSkeleton;
