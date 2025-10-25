"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WeeklySpendingCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full w-full bg-card/50 backdrop-blur-md border border-border shadow-md rounded-xl animate-pulse flex flex-col">
      {/* Top Section */}
      <CardHeader className="text-left flex flex-col gap-2 pb-2">
        <Skeleton className="h-6 w-36 bg-muted rounded-md" /> {/* title */}
        <Skeleton className="h-10 w-28 bg-muted rounded-md" />{" "}
        {/* total spend */}
      </CardHeader>

      {/* Chart Section */}
      <CardContent className="flex-1 min-h-[180px] pt-0">
        <div className="relative w-full h-full flex flex-col justify-center items-center gap-2">
          {/* mimic the area chart with multiple lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-3 w-${20 + i * 10} bg-muted rounded-full`}
            />
          ))}
        </div>
      </CardContent>

      {/* Bottom Boxes */}
      <div className="mt-4 w-full flex flex-col gap-3 px-3 pb-4">
        <Skeleton className="h-12 w-full rounded-lg bg-muted" />{" "}
        {/* all time */}
        <Skeleton className="h-12 w-full rounded-lg bg-muted" />{" "}
        {/* this month */}
      </div>
    </Card>
  );
};

export default WeeklySpendingCardSkeleton;
