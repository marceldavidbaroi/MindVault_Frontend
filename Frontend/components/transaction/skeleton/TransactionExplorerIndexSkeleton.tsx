"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionExplorerSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Filters Skeleton */}
      <div className="bg-background rounded-sm shadow-sm p-3 space-y-3">
        <Skeleton className="h-6 w-32 rounded-md" /> {/* Filters Title */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-end gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-8 w-12 rounded-md" />
        ))}
      </div>

      {/* Transaction List Skeleton */}
      <div className="flex flex-col p-2 text-sm space-y-2">
        {/* List Header */}
        <div className="grid grid-cols-5 gap-2 px-3 py-1 font-semibold">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="h-4 w-full rounded-sm" />
          ))}
        </div>

        {/* List Rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-5 gap-2 items-center p-2 rounded-md border border-white/10 bg-white/5"
          >
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <Skeleton key={colIdx} className="h-4 w-full rounded-sm" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-end gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-8 w-12 rounded-md" />
        ))}
      </div>
    </div>
  );
}
