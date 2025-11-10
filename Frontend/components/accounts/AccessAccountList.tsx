"use client";

import React from "react";
import { useAccountStore } from "@/store/accountStore";

export const AccessAccountList: React.FC = () => {
  const accessAccounts = useAccountStore((state) => state.accessAccounts);

  const handleClick = (item: any) => {
    console.log("Clicked access account:", item);
  };

  if (!accessAccounts?.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No access accounts found
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2 max-w-3xl mx-auto">
      {accessAccounts.map((item) => (
        <div
          key={item.id}
          onClick={() => handleClick(item)}
          className="
           bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex justify-between items-center
          "
        >
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {item.account?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Role: {item.role?.displayName ?? item.role?.name}
            </p>
          </div>

          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-sm text-foreground">
              Balance: {item.account?.balance}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
