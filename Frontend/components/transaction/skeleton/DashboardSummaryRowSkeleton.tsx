"use client";

import React from "react";

const DashboardSummaryRowSkeleton = () => {
  return (
    <div className="flex gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between py-2 px-4 rounded-xl shadow-md w-[250px] h-[160px]
                     backdrop-blur-md border border-gray-200/20 bg-white/10 dark:bg-black/20
                     animate-pulse"
        >
          {/* Title */}
          <div className="h-5 w-20 rounded bg-chart-1 dark:bg-white/10 mb-4" />

          <div className="flex justify-between gap-4">
            {/* Current */}
            <div className="flex flex-col gap-3">
              <div className="h-3 w-14 rounded bg-white/15" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-1" />
                <div className="h-4 w-16 rounded bg-chart-1" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-1" />
                <div className="h-3 w-14 rounded bg-chart-1" />
              </div>
            </div>

            {/* Previous */}
            <div className="flex flex-col gap-3">
              <div className="h-3 w-14 rounded bg-white/15" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-1" />
                <div className="h-4 w-16 rounded bg-chart-1" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-chart-1" />
                <div className="h-3 w-14 rounded bg-chart-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummaryRowSkeleton;
