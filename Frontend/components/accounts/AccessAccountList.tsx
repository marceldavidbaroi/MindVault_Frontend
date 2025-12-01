"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccountStore } from "@/store/accountStore";
import { ArrowRightCircle } from "lucide-react";

export const AccessAccountList: React.FC = () => {
  const accessAccounts = useAccountStore((state) => state.accessAccounts);
  const router = useRouter();

  const openAccount = (item: any) => {
    router.push(`/finance/accounts/${item.account?.id}`);
  };

  const openTransactionPage = (item: any) => {
    router.push(`/finance/transaction/${item.account?.id}`);
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
          className="
            relative bg-white/20 backdrop-blur-md border border-white/30 
            rounded-lg shadow hover:shadow-lg transition-shadow
            p-4 cursor-pointer
            flex justify-between items-center
          "
        >
          {/* Clickable card area */}
          <div onClick={() => openAccount(item)} className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              #{item.account?.id} {item.account?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Role: {item.role?.displayName ?? item.role?.name}
            </p>
            <p className="text-sm font-medium text-foreground">
              Balance: {item.account?.balance}
            </p>
          </div>

          {/* Redirect button */}
          <button
            onClick={() => openTransactionPage(item)}
            className="
              ml-4 p-2 rounded-full hover:bg-white/30 active:scale-95 
              transition flex items-center justify-center
            "
          >
            <ArrowRightCircle className="w-6 h-6 text-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
};
