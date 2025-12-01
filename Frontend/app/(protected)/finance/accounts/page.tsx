import AccountIndex from "@/components/accounts/AccountIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { AccessAccount, Account } from "@/types/Account.type";
import { ApiResponse } from "@/types/ApiResponse.type";
import { cookies } from "next/headers";
import React from "react";

const AccountsPage = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const myAccountRes: ApiResponse<Account[]> = await fetcher(
    ENDPOINTS.accounts.my,
    {
      method: "GET",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }
  );
  const accessAccountRes: ApiResponse<AccessAccount[]> = await fetcher(
    ENDPOINTS.accounts.access,
    {
      method: "GET",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }
  );
  const myAccounts = myAccountRes?.data ?? [];
  const accessAccounts = accessAccountRes?.data ?? [];

  return (
    <AccountIndex myAccounts={myAccounts} accessAccounts={accessAccounts} />
  );
};

export default AccountsPage;
