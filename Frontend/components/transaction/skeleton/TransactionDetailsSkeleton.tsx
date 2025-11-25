"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionDetailsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto mt-4 p-3 animate-pulse">
      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-md rounded-xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48 rounded-md" /> {/* Title */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm"
              >
                <Skeleton className="h-3 w-24 mb-1 rounded-sm" /> {/* label */}
                <Skeleton className="h-4 w-full rounded-sm" /> {/* value */}
              </div>
            ))}
            {/* Description spans full width */}
            <div className="sm:col-span-2 p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
              <Skeleton className="h-3 w-32 mb-1 rounded-sm" /> {/* label */}
              <Skeleton className="h-12 w-full rounded-sm" />{" "}
              {/* multi-line value */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
