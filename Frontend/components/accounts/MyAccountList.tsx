"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccountStore } from "@/store/accountStore";
import type { Account } from "@/types/Account.type";
import { ArrowRightCircle } from "lucide-react"; // Better redirect icon

export const MyAccountList: React.FC = () => {
  const accounts = useAccountStore((state) => state.accounts);
  const router = useRouter();

  const openAccount = (account: Account) => {
    router.push(`/finance/accounts/${account.id}`);
  };

  const openTransactionPage = (account: Account) => {
    router.push(`/finance/transaction/${account.id}`);
  };

  if (!accounts?.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No accounts found
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2 max-w-3xl mx-auto">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="
            relative bg-white/20 backdrop-blur-md border border-white/30 
            rounded-lg shadow hover:shadow-lg transition-shadow
            p-4 cursor-pointer
            flex justify-between items-center
          "
        >
          {/* Entire card clickable except the icon */}
          <div onClick={() => openAccount(account)} className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              #{account.id} {account.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Type: {account.type?.name ?? "N/A"}
            </p>
            {account.currencyCode && (
              <p className="text-sm text-muted-foreground">
                Currency: {account.currencyCode.name} (
                {account.currencyCode.symbol})
              </p>
            )}
            <p className="text-sm font-medium text-foreground">
              Balance:{" "}
              {account.currencyCode
                ? `${account.currencyCode.symbol} ${account.balance}`
                : account.balance}
            </p>
          </div>

          {/* Transaction icon button */}
          <button
            onClick={() => openTransactionPage(account)}
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
