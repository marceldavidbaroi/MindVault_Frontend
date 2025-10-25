import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionTableMiniSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-md animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center p-3">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="flex-1 overflow-hidden p-3">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="hidden sm:table-cell">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="hidden sm:table-cell">
                <Skeleton className="h-4 w-48" />
              </th>
              <th className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border/10">
                <td className="py-2">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="hidden sm:table-cell py-2">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="hidden sm:table-cell py-2">
                  <Skeleton className="h-4 w-48" />
                </td>
                <td className="text-right py-2">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTableMiniSkeleton;
