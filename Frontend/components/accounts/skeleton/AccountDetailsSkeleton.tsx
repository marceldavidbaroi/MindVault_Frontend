"use client";

import React from "react";

const AccountDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Skeleton for Account Info */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-4 animate-pulse rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/20 rounded"></div>
            <div className="h-4 w-64 bg-white/10 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
        </div>
      </div>

      {/* Skeleton for Account Members */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-4 animate-pulse rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-white/20 rounded"></div>
          <div className="h-8 w-24 bg-white/20 rounded"></div>
        </div>
        <div className="space-y-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 px-1 bg-white/5 rounded-lg"
            >
              <div className="space-y-1">
                <div className="h-4 w-32 bg-white/20 rounded"></div>
                <div className="h-3 w-40 bg-white/10 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-white/20 rounded-full"></div>
                <div className="h-8 w-8 bg-white/20 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsSkeleton;
