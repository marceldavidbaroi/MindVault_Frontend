"use client";
import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import React, { useEffect } from "react";

const TransactionExplorerPage = () => {
  const accountStore = useAccountStore();
  useEffect(() => {
    accountStore.getAccountsWithAccess();
  }, []);
  return (
    <>
      <div className="max-w-[250px]">
        <AccountsList redirectBase="/finance/transaction-explorer" />
      </div>
    </>
  );
};

export default TransactionExplorerPage;
