"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <ul className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="flex justify-between items-center px-4 py-3 rounded-md animate-pulse"
        >
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TransactionListSkeleton;
