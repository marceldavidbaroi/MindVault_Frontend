"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CategoryListSkeleton = () => {
  const renderSkeletonItem = () => (
    <li className="flex justify-between items-center px-3 py-2 border border-border/50 rounded-md bg-muted animate-pulse">
      <span className="h-4 w-24 bg-gray-300 rounded"></span>
      <span className="h-4 w-12 bg-gray-300 rounded"></span>
    </li>
  );

  const renderSkeletonCard = (title: string) => (
    <Card className="flex-1 border border-border shadow-md bg-card h-full animate-pulse">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="h-6 w-32 bg-gray-300 rounded"></CardTitle>
        <span className="h-5 w-10 bg-gray-300 rounded"></span>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <ul className="flex flex-col gap-1 p-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <React.Fragment key={idx}>{renderSkeletonItem()}</React.Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {renderSkeletonCard("Income")}
      {renderSkeletonCard("Expense")}
    </div>
  );
};

export default CategoryListSkeleton;
