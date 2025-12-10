import { API_ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { AccountTypeList } from "@/components/accounts/AccountTypeList";
import { cookies } from "next/headers";
import React from "react";
import { AccountType } from "@/types/Account.type";
import { ApiResponse } from "@/types/ApiResponse.type";
import AccountTypeIndex from "@/components/accounts/AccountTypeIndex";
import { AccountTypeListSkeleton } from "@/components/accounts/skeleton/AccountTypeListSkeleton";

const AccountTypesPage = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const accountTypesRes: ApiResponse<AccountType[]> = await fetcher(
    API_ENDPOINTS.accounts.types.all,
    {
      method: "GET",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }
  );

  const accountTypes = accountTypesRes?.data || [];

  return (
    <div className="max-w-[1024px] mx-auto p-4">
      <h1 className="text-2xl font-bold text-foreground mb-4 text-center">
        Account Types
      </h1>

      <AccountTypeIndex data={accountTypes} />
    </div>
  );
};

export default AccountTypesPage;
