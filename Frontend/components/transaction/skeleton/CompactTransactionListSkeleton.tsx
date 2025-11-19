"use client";

export default function CompactTransactionListSkeleton() {
  return (
    <div className="w-full h-full p-3 space-y-3 backdrop-blur-md bg-background/60 rounded-xl border border-white/20 shadow-md animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-lg bg-background/40 backdrop-blur-md border border-white/10"
        >
          {/* Left side (type + date + category) */}
          <div className="flex flex-col space-y-1">
            <div className="h-3 w-16 bg-chart-1 rounded" />
            <div className="h-2 w-20 bg-chart-1 rounded" />
            <div className="h-2 w-14 bg-chart-1 rounded" />
          </div>

          {/* Amount and status */}
          <div className="flex flex-col items-end space-y-1">
            <div className="h-3 w-12 bg-chart-1 rounded" />
            <div className="h-2 w-8 bg-chart-1 rounded" />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 ml-4">
            <div className="h-7 w-7 rounded-md bg-chart-1" />
            <div className="h-7 w-7 rounded-md bg-chart-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
