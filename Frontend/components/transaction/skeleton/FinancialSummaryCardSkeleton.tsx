"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FinancialSummaryCardSkeleton: React.FC = () => {
  return (
    <Card className="w-full min-w-[260px] sm:min-w-[280px] md:w-64 lg:w-72 xl:w-80 min-h-[130px] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl animate-pulse">
      <CardHeader className="flex justify-between items-center px-3 py-0 sm:px-4 sm:py-0">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-3 py-1 sm:px-4 sm:py-1">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryCardSkeleton;
