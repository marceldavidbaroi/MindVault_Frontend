import AccountsList from "@/components/transaction/AccountList";
import CreateAccountButton from "@/components/transaction/CreateAccountButton";
import TransactionIndex from "@/components/transaction/TransactionIndex";
import { ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { AccessAccount } from "@/types/Account.type";
import { ApiResponse } from "@/types/ApiResponse.type";
import { AlertCircle } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";

interface TransactionPageProps {
  params?: { id?: string | number };
}

const TransactionPage = async ({ params }: TransactionPageProps) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // ✅ Check if accountId exists and convert to number

  const accessAccountRes: ApiResponse<AccessAccount[]> = await fetcher(
    ENDPOINTS.accounts.access,
    {
      method: "GET",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }
  );
  const accessAccounts = accessAccountRes?.data ?? [];

  return (
    <div className="h-[80vh] grid grid-cols-12 gap-3 p-3">
      {/* LEFT SIDEBAR - GLASS */}
      <div
        className="
      col-span-2 h-full
      rounded-xl
      backdrop-blur-md
      bg-white/10 dark:bg-black/20
      
      flex flex-col
      overflow-y-auto
      scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent
    "
      >
        {accessAccounts.length !== 0 && (
          <AccountsList accountsData={accessAccounts} />
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-10 grid grid-rows-[30%_70%] gap-3">
        {accessAccounts.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold">No accounts found</h2>
            <p className="mt-2 text-lg">
              Please create an account to start transactions
            </p>
            <CreateAccountButton /> {/* Modern glass-themed button */}
          </div>
        )}
        {accessAccounts.length !== 0 && (
          <div className="flex flex-col justify-center items-center h-full text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold">No accounts selected</h2>
            <p className="mt-2 text-lg">
              Please select an account to start transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
