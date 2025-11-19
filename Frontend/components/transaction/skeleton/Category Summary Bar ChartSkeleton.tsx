"use client";

export default function CategorySummaryChartSkeleton() {
  return (
    <div className="w-full h-full p-4 md:p-6 bg-background/50 backdrop-blur-md rounded-xl border border-white/20 shadow-lg flex flex-col animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 flex-shrink-0">
        {/* Toggle buttons */}
        <div className="flex space-x-2">
          <div className="h-8 w-20 rounded-md bg-chart-1" />
          <div className="h-8 w-20 rounded-md bg-chart-1" />
        </div>

        {/* Date / Month placeholder */}
        <div className="h-8 w-32 rounded-md bg-chart-1" />
      </div>

      {/* Chart skeleton */}
      <div className="flex-1 mt-2 space-y-4">
        {/* Fake bars */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="h-4 w-24 bg-chart-1 rounded" />
            <div
              className={`h-4 bg-chart-1 rounded flex-1`}
              style={{ width: `${40 + i * 10}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
