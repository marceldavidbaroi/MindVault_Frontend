"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionExplorerListSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });

  return (
    <Card className="w-full bg-transparent shadow-none border-none">
      <div className="overflow-x-auto rounded-lg border border-border/20">
        <table className="min-w-full text-sm bg-transparent">
          <thead className="bg-transparent text-xs uppercase text-muted-foreground/70">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Description</th>
              <th className="px-4 py-2 text-right font-medium">Amount</th>
              <th className="px-4 py-2 text-center font-medium">Type</th>
              <th className="px-4 py-2 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((_, i) => (
              <tr
                key={i}
                className={`border-t border-border/20 ${
                  i % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                }`}
              >
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-20 bg-muted/60 dark:bg-muted/40" />
                </td>
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-24 bg-muted/60 dark:bg-muted/40" />
                </td>
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-[200px] bg-muted/60 dark:bg-muted/40" />
                </td>
                <td className="px-4 py-2 text-right">
                  <Skeleton className="h-4 w-16 ml-auto bg-muted/60 dark:bg-muted/40" />
                </td>
                <td className="px-4 py-2 text-center">
                  <Skeleton className="h-5 w-14 mx-auto rounded-full bg-muted/60 dark:bg-muted/40" />
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-md bg-muted/60 dark:bg-muted/40" />
                    <Skeleton className="h-7 w-7 rounded-md bg-muted/60 dark:bg-muted/40" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionExplorerListSkeleton;
