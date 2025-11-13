"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccountStore } from "@/store/accountStore";
import type { Account } from "@/types/Account.type";

export const MyAccountList: React.FC = () => {
  const accounts = useAccountStore((state) => state.accounts);
  const router = useRouter();

  const handleClick = (account: Account) => {
    router.push(`/finance/accounts/${account.id}`);
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
          onClick={() => handleClick(account)}
          className="
            bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex justify-between items-center cursor-pointer
          "
        >
          <div>
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
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-sm font-medium text-foreground">
              Balance:{" "}
              {account.currencyCode
                ? `${account.currencyCode.symbol} ${account.balance}`
                : account.balance}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
