"use client";

import React, { useEffect, useState } from "react";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/rolesStore";
import { useCurrencyStore } from "@/store/currencyStore";
import AccountInfo from "./AccountInfo";
import AccountMembers from "./AccountMembers";
import AccountDetailsSkeleton from "./skeleton/AccountDetailsSkeleton";

interface AccountDetailsProps {
  id: number;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ id }) => {
  const accountStore = useAccountStore();
  const roleStore = useRoleStore();
  const currencyStore = useCurrencyStore();

  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [accountTypes, setAccountTypes] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);

  const getAccountDetails = async () => {
    setLoading(true);
    try {
      const [accountRes, roleRes, accountTypesRes, currenciesRes] =
        await Promise.all([
          accountStore.getAccount(id),
          roleStore.getAllRoles(),
          accountStore.getAllAccountTypes(),
          currencyStore.getAllCurrencies(),
        ]);

      setAccount(accountRes?.data || null);
      setRoles(roleRes?.data || []);
      setAccountTypes(accountTypesRes?.data || []);
      setCurrencies(currenciesRes?.data || []);
    } catch (error) {
      console.error("Failed to fetch account details:", error);
      setAccount(null); // ensures no stale data
    } finally {
      setLoading(false); // always set loading to false
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, [id]);

  const refreshAccount = async () => {
    try {
      const updated = await accountStore.getAccount(id);
      setAccount(updated?.data || null);
    } catch (error) {
      console.error("Failed to refresh account:", error);
    }
  };

  if (loading) return <AccountDetailsSkeleton />;
  if (!account)
    return (
      <div className="text-center text-muted-foreground py-6">
        No account found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <AccountInfo
        account={account}
        roles={roles}
        accountTypes={accountTypes}
        currencies={currencies}
        refreshAccount={refreshAccount}
      />
      <AccountMembers
        account={account}
        roles={roles}
        refreshAccount={refreshAccount}
      />
    </div>
  );
};

export default AccountDetails;
