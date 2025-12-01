"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccountStore } from "@/store/accountStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { AccessAccount } from "@/types/Account.type";

interface AccountsListProps {
  mode?: "normal" | "mini";
  accountsData?: AccessAccount[];
  redirectBase?: string;
  enableRedirect?: boolean; // <-- NEW FLAG
}

export default function AccountsList({
  mode = "normal",
  accountsData,
  redirectBase = "/finance/transaction",
  enableRedirect = true, // <-- DEFAULT TRUE
}: AccountsListProps) {
  const router = useRouter();
  const {
    accessAccounts,
    selectedAccountId,
    getAccountsWithAccess,
    setAccessAccounts,
    setSelectedAccountId,
  } = useAccountStore();

  useEffect(() => {
    if (accessAccounts.length === 0) {
      getAccountsWithAccess();
    }
  }, []);
  useEffect(() => {
    if (accountsData && accountsData.length > 0) {
      setAccessAccounts(accountsData);
    }
  }, [accountsData]);

  const accounts = accountsData?.length ? accountsData : accessAccounts;

  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No accounts found.
      </div>
    );
  }

  const onSelect = (item: AccessAccount) => {
    if (enableRedirect) {
      router.push(`${redirectBase}/${item?.account?.id}`);
    } else {
      setSelectedAccountId(item?.account?.id);
    }
  };

  // MINI MODE
  if (mode === "mini") {
    const selectedAccount = accounts.find(
      (acc) => acc.id === selectedAccountId
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="
              flex items-center gap-2 
              bg-primary text-primary-foreground 
              hover:bg-primary/80 
            "
          >
            {selectedAccount ? selectedAccount.account.name : "Select Account"}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="
            w-56 
            backdrop-blur-md 
            bg-background/80 
            border border-primary/20 
            shadow-xl
          "
        >
          {accounts.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => onSelect(item)}
              className={`
                flex flex-col items-start py-2
                bg-primary/10 
                hover:bg-primary/20
                cursor-pointer
                ${item.account.id === selectedAccountId ? "bg-primary/30" : ""}
              `}
            >
              <span className="font-medium text-sm text-primary-900 dark:text-primary-200">
                {item.account.name}
              </span>

              <span className="text-xs text-primary-700 dark:text-primary-300">
                Balance: {item.account.balance}
              </span>

              <span className="text-xs text-primary-700 dark:text-primary-300">
                Role: {item.role.displayName}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // NORMAL MODE
  return (
    <div className="w-full overflow-hidden rounded-lg bg-background/40 backdrop-blur-md border border-primary/20 shadow-sm">
      <ul className="divide-y divide-primary/10">
        {accounts.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              px-3 py-2 cursor-pointer select-none
              hover:bg-primary/10 transition-all text-sm
              ${item.account.id === selectedAccountId ? "bg-primary/20" : ""}
            `}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground truncate">
                {item.account.name}
              </span>
              <span className="text-xs text-primary truncate font-semibold">
                {item.role.displayName}
              </span>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
              <span>Balance</span>
              <span className="font-semibold text-foreground">
                {item.account.balance}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
