"use client";
import React, { useEffect } from "react";
import { AccountTypeList } from "./AccountTypeList";
import { AccountType } from "@/types/Account.type";
import { useAccountStore } from "@/store/accountStore";
import { AccountTypeListSkeleton } from "./skeleton/AccountTypeListSkeleton";

interface AccountTypeIndexProps {
  data: AccountType[];
}

const AccountTypeIndex: React.FC<AccountTypeIndexProps> = ({ data }) => {
  const accountStore = useAccountStore();

  useEffect(() => {
    accountStore.setAccountTypes(data);
  }, [data]);

  return (
    <>
      {accountStore.accountTypes.length > 0 ? (
        <AccountTypeList />
      ) : (
        <AccountTypeListSkeleton />
      )}
    </>
  );
};

export default AccountTypeIndex;
