"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAccountStore } from "@/store/accountStore";
import { AccessAccount, Account } from "@/types/Account.type";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MyAccountList } from "@/components/accounts/MyAccountList";
import { AccessAccountList } from "./AccessAccountList";
import { AccountForm } from "./CreateAccountDialog";
import { useCurrencyStore } from "@/store/currencyStore";

interface AccountIndexProps {
  myAccounts: Account[];
  accessAccounts: AccessAccount[];
}

const AccountIndex: React.FC<AccountIndexProps> = ({
  myAccounts,
  accessAccounts = [],
}) => {
  const currencyStore = useCurrencyStore();
  const accountStore = useAccountStore();
  const [selectedTab, setSelectedTab] = useState<"my" | "access">("my");
  const [create, setCreate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch both in parallel
      await Promise.all([
        accountStore.getAllAccountTypes(),
        currencyStore.getAllCurrencies(),
      ]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Load both sets into store
    accountStore.setAccounts(myAccounts);
    accountStore.setAccessAccounts(accessAccounts);
  }, [myAccounts, accessAccounts]);

  const data = useMemo(
    () => (selectedTab === "my" ? myAccounts : accessAccounts),
    [selectedTab, myAccounts, accessAccounts]
  );

  const handleCreateAccount = () => {
    setCreate(true); // Here you can open a modal or navigate to a create account page
  };

  return (
    <div className="space-y-6 max-w-[1024px] mx-auto">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Accounts</h2>
        <Button onClick={handleCreateAccount} className="rounded-full px-6">
          + Create Account
        </Button>
      </div>

      {/* Tab Toggle */}
      <div className="flex justify-center space-x-3">
        <Button
          variant={selectedTab === "my" ? "default" : "outline"}
          onClick={() => setSelectedTab("my")}
          className={cn(
            "rounded-full px-6",
            selectedTab === "my" && "shadow-md"
          )}
        >
          My Accounts
        </Button>
        <Button
          variant={selectedTab === "access" ? "default" : "outline"}
          onClick={() => setSelectedTab("access")}
          className={cn(
            "rounded-full px-6",
            selectedTab === "access" && "shadow-md"
          )}
        >
          Access Accounts
        </Button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {selectedTab === "my" && <MyAccountList />}
        {selectedTab === "access" && <AccessAccountList />}
      </div>
      <AccountForm open={create} onClose={() => setCreate(false)} />
    </div>
  );
};

export default AccountIndex;
