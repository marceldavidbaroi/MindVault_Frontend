"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WeeklySpendingCardSkeleton: React.FC = () => {
  return (
    <Card
      className="
        h-full w-full 
        bg-card/50 
        backdrop-blur-md 
        border border-border 
        shadow-md 
        rounded-xl 
        animate-pulse 
        flex flex-col
      "
    >
      <CardHeader className="text-left">
        <Skeleton className="h-6 w-40 mb-2 bg-muted" />
        <Skeleton className="h-12 w-32 bg-muted" />
      </CardHeader>

      <CardContent className="flex-1 min-h-[200px]">
        <Skeleton className="h-full w-full rounded-md bg-muted" />
      </CardContent>

      <div className="mt-4 w-full flex flex-col gap-3 px-3">
        <Skeleton className="h-12 w-full rounded-lg bg-muted" />
        <Skeleton className="h-12 w-full rounded-lg bg-muted" />
      </div>
    </Card>
  );
};

export default WeeklySpendingCardSkeleton;
