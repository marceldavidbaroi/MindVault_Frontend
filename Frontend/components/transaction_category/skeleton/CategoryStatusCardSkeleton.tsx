"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CategoryStatusCardSkeleton = () => {
  const renderSkeletonCard = () => (
    <Card className="bg-card border border-border shadow flex-1 min-w-[220px] animate-pulse">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="h-5 w-32 bg-gray-300 rounded" />
        <span className="h-6 w-12 bg-gray-300 rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );

  const renderSkeletonCardWithDetails = () => (
    <Card className="flex-1 min-w-[220px] border border-border shadow animate-pulse">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="h-5 w-32 bg-gray-300 rounded" />
        <span className="h-6 w-12 bg-gray-300 rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="h-4 w-20 bg-gray-200 rounded" />
          <span className="h-4 w-12 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between">
          <span className="h-4 w-20 bg-gray-200 rounded" />
          <span className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-between lg:flex-col">
      {renderSkeletonCard()} {/* Total */}
      {renderSkeletonCardWithDetails()} {/* Income */}
      {renderSkeletonCardWithDetails()} {/* Expense */}
    </div>
  );
};

export default CategoryStatusCardSkeleton;
