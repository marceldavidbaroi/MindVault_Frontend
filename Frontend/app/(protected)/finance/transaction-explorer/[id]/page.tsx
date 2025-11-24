"use client";

import AccountsList from "@/components/transaction/AccountList";
import { useAccountStore } from "@/store/accountStore";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import TransactionExplorerIndex from "@/components/transaction/TransactionExplorerIndex";
import { useCategoryStore } from "@/store/categoryStore";
import { useCurrencyStore } from "@/store/currencyStore";

const TransactionExplorerPage = () => {
  const accountStore = useAccountStore();
  const params = useParams();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrencyStore();

  const routeAccountId = params?.id ? Number(params.id) : undefined;

  // ref to track last param value
  const previousIdRef = useRef<number | undefined>(undefined);

  const prevIdRef = useRef<number | null>(null);
  const init = async () => {
    await Promise.all([
      accountStore.getAccountsWithAccess(),
      accountStore.getAccountRoles(Number(accountStore.selectedAccountId)),
      accountStore.getAccount(Number(accountStore.selectedAccountId)),
      accountStore.getAccountsWithAccess(),
      categoryStore.getAllCategories(),
      currencyStore.getAllCurrencies(),
    ]);
  };

  useEffect(() => {
    const rawId = accountStore.selectedAccountId;
    if (!rawId) return;

    const currentId = Number(rawId); // ✅ always a number

    if (Number.isNaN(currentId)) return;

    // Skip if same as previous
    if (prevIdRef.current === currentId) return;

    // Update previous
    prevIdRef.current = currentId;
    init();
    // Run only once per REAL change
  }, [accountStore.selectedAccountId]);

  useEffect(() => {
    console.log("thi si sithe issue ");
    if (!routeAccountId) return;

    const prev = previousIdRef.current;
    const storeId = accountStore.selectedAccountId;

    // Only update if ID actually changed
    if (previousIdRef.current !== routeAccountId) {
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
      {" "}
      <TransactionExplorerIndex />{" "}
    </>
  );
};

export default TransactionExplorerPage;
