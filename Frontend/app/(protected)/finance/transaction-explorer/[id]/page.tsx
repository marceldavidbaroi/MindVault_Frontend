"use client";

import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import TransactionExplorerIndex from "@/components/transaction/TransactionExplorerIndex";

const TransactionExplorerPage = () => {
  const accountStore = useAccountStore();
  const params = useParams();

  const routeAccountId = params?.id ? Number(params.id) : undefined;

  // ref to track last param value
  const previousIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // run once for accounts
    accountStore.getAccountsWithAccess();
    accountStore.getAccountRoles(Number(accountStore.selectedAccountId));
  }, []);

  useEffect(() => {
    if (!routeAccountId) return;

    const prev = previousIdRef.current;
    const storeId = accountStore.selectedAccountId;

    // Only update if ID actually changed
    if (routeAccountId !== prev || routeAccountId !== storeId) {
      console.log("URL param changed:", {
        prevParam: prev,
        newParam: routeAccountId,
        storeSelected: storeId,
      });

      accountStore.setSelectedAccountId(routeAccountId);

      // update previous
      previousIdRef.current = routeAccountId;
    }
  }, [routeAccountId]);

  return (
    <>
      <TransactionExplorerIndex />
    </>
  );
};

export default TransactionExplorerPage;
