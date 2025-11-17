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
  accountsData?: AccessAccount[]; // optional prop
}

export default function AccountsList({
  mode = "normal",
  accountsData,
}: AccountsListProps) {
  const router = useRouter();
  const {
    accessAccounts,
    selectedAccountId,
    setAccessAccounts,
    setSelectedAccountId,
  } = useAccountStore();

  // If props are passed, update the store
  useEffect(() => {
    if (accountsData && accountsData.length > 0) {
      setAccessAccounts(accountsData);

      // If selectedAccountId exists in store, keep it

      // Otherwise, default to first account
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
    setSelectedAccountId(item.id);
    router.push(`/finance/transaction/${item.id}`);
  };

  // MINI MODE
  if (mode === "mini") {
    const selectedAccount = accounts.find(
      (acc) => acc.id === selectedAccountId
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2 backdrop-blur-md bg-primary/10 border-primary/20">
            {selectedAccount ? selectedAccount.account.name : "Select Account"}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-56 backdrop-blur-md bg-background/80 border border-primary/20 shadow-xl"
        >
          {accounts.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex flex-col items-start py-2 ${
                item.id === selectedAccountId ? "bg-primary/20" : ""
              }`}
            >
              <span className="font-medium text-sm">{item.account.name}</span>
              <span className="text-xs text-muted-foreground">
                Balance: {item.account.balance}
              </span>
              <span className="text-xs text-muted-foreground">
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
            className={`px-3 py-2 cursor-pointer select-none hover:bg-primary/10 transition-all text-sm ${
              item.id === selectedAccountId ? "bg-primary/20" : ""
            }`}
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
