"use client";
import React from "react";
// Import UI components used for structure
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

/**
 * CurrencyViewSkeleton displays a loading placeholder that mimics the structure
 * and elegant glassmorphism styling of the CurrencyView component.
 */
const CurrencyViewSkeleton: React.FC = () => {
  // Renders a single loading placeholder item, matching the complex layout
  const renderSkeletonItem = (index: number) => (
    <div
      key={index}
      // Mimics the item's glass effect, hover area, and spacing
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between 
                 p-4 border border-white/20 rounded-2xl mb-3 
                 bg-white/5 dark:bg-gray-900/5 shadow-inner 
                 animate-pulse"
    >
      {/* Left Group: Name and Code */}
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        {/* Placeholder for Currency Name */}
        <div className="h-5 w-32 rounded bg-white/20 dark:bg-gray-700/50" />
        {/* Placeholder for Code Badge */}
        <div className="h-5 w-12 rounded-full bg-white/10 dark:bg-gray-700/30" />
      </div>

      {/* Right Group: Symbol and Decimal Placeholders */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        {/* Placeholder for Symbol (More prominent area) */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-white/10 dark:bg-gray-700/20" />{" "}
          {/* "Symbol:" label */}
          <div className="h-8 w-10 rounded-lg bg-white/20 dark:bg-gray-700/50" />{" "}
          {/* Symbol character */}
        </div>

        {/* Placeholder for Decimal Places */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-white/10 dark:bg-gray-700/20" />{" "}
          {/* "Decimals:" label */}
          <div className="h-6 w-8 rounded-lg bg-white/20 dark:bg-gray-700/50" />{" "}
          {/* Decimal number */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Placeholder for the main title */}
      <div className="h-8 w-64 rounded bg-white/20 dark:bg-gray-800/50 animate-pulse drop-shadow-lg" />

      {/* Main Card with Glassmorphism effect */}
      <Card
        className="shadow-xl border-2 border-white/20 
                   bg-white/5 dark:bg-gray-900/10 backdrop-blur-sm"
      >
        {/* Card Header Placeholder */}
        <CardHeader className="p-5 border-b border-white/20 dark:border-gray-700/50 bg-white/10 dark:bg-gray-900/10">
          <CardTitle className="text-2xl font-bold flex items-center justify-between text-transparent">
            {/* Placeholder for Title and Count */}
            <div className="h-6 w-48 rounded bg-white/30 dark:bg-gray-700/70 animate-pulse" />
          </CardTitle>

          {/* Search Input Placeholder */}
          <div className="relative mt-4 animate-pulse">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
            <div
              className="pl-10 h-10 border-white/30 rounded-lg 
                         bg-white/30 dark:bg-gray-700/50"
            />
          </div>
        </CardHeader>

        {/* List Content Area */}
        <CardContent className="p-3">
          <ScrollArea className="h-[70vh] min-h-[300px] p-2">
            <div className="space-y-3">
              {[...Array(8)].map((_, index) => renderSkeletonItem(index))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyViewSkeleton;
