"use client";

import React, { useEffect, useState } from "react";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/rolesStore";
import { useCurrencyStore } from "@/store/currencyStore";
import AccountInfo from "./AccountInfo";
import AccountMembers from "./AccountMembers";
import AccountDetailsSkeleton from "./skeleton/AccountDetailsSkeleton";
import { useAccountRole } from "@/composables/finance/accounts/useAccountRole";

interface AccountDetailsProps {
  id: number;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ id }) => {
  const accountStore = useAccountStore();
  const roleStore = useRoleStore();
  const currencyStore = useCurrencyStore();
  const { getPermissions } = useAccountRole(); // composable function

  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [accountTypes, setAccountTypes] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [permissions, setPermissions] = useState({
    isOwner: false,
    isOwnerOrAdmin: false,
    canEdit: false,
  });

  const getAccountDetails = async () => {
    setLoading(true);
    try {
      const [accountRes, accountTypesRes, currenciesRes] = await Promise.all([
        accountStore.getAccount(id),
        accountStore.getAllAccountTypes(),
        currencyStore.getAllCurrencies(),
      ]);

      setAccount(accountRes?.data || null);
      setAccountTypes(accountTypesRes?.data || []);
      setCurrencies(currenciesRes?.data || []);

      // Get permissions for the current account
      const perms = await getPermissions(id);
      console.log(perms);
      setPermissions(perms);
    } catch (error) {
      console.error("Failed to fetch account details:", error);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, [id]);

  const refreshAccount = async () => {
    try {
      const updated = await accountStore.getAccount(id);
      setAccount(updated?.data || null);

      // Refresh permissions
      const perms = await getPermissions(id);
      setPermissions(perms);
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
        permissions={permissions} // pass permissions as prop
      />
      <AccountMembers
        account={account}
        roles={roles}
        refreshAccount={refreshAccount}
        permissions={permissions} // pass permissions as prop
      />
    </div>
  );
};

export default AccountDetails;
