"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const AccountTypeListSkeleton: React.FC = () => {
  const [search, setSearch] = useState("");

  // For skeleton, we define fake scopes and counts
  const scopes = ["personal", "business", "family", "shared"];
  const itemsPerScope = 3;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Search input skeleton */}
      <div className="max-w-sm mx-auto">
        <Input
          placeholder="Search account types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled
        />
      </div>

      {/* Skeleton list */}
      {scopes.map((scope) => (
        <div key={scope} className="space-y-3">
          {/* Scope title skeleton */}
          <Skeleton className="h-6 w-32 mb-2 rounded-md" />
          <ul className="space-y-2">
            {Array.from({ length: itemsPerScope }).map((_, j) => (
              <li
                key={j}
                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow p-4 flex justify-between items-center animate-pulse"
              >
                <div className="space-y-1 w-full max-w-[80%]">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-3 w-60 rounded-md" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
