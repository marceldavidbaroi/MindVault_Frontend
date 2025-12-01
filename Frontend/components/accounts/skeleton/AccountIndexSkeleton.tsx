"use client";

import React from "react";

export const AccountIndexSkeleton: React.FC = () => {
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="space-y-6 max-w-[1024px] mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-7 w-40 bg-chart-1 rounded" />
        <div className="h-10 w-36 bg-chart-1 rounded-full" />
      </div>

      {/* Tab Buttons Skeleton */}
      <div className="flex justify-center space-x-3">
        <div className="h-10 w-32 bg-chart-1/20 rounded-full" />
        <div className="h-10 w-36 bg-chart-1/20 rounded-full" />
      </div>

      {/* Account List Skeleton */}
      <div className="space-y-3 p-2 max-w-3xl mx-auto">
        {skeletonItems.map((_, i) => (
          <div
            key={i}
            className="
              bg-chart-1/20 backdrop-blur-md border border-chart-1 rounded-lg 
              shadow p-4 flex justify-between items-center
            "
          >
            {/* Left side */}
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-chart-1 rounded"></div>
              <div className="h-4 w-28 bg-chart-1/20 rounded"></div>
              <div className="h-4 w-32 bg-chart-1/20 rounded"></div>
              <div className="h-4 w-24 bg-chart-1/20 rounded"></div>
            </div>

            {/* Right icon */}
            <div className="ml-4">
              <div className="h-8 w-8 bg-chart-1 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
