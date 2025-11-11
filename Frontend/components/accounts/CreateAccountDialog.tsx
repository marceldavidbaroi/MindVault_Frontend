"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccountStore } from "@/store/accountStore";
import { AccountType, Account } from "@/types/Account.type";
import { Currency } from "@/types/Currency.type";
import { useCurrencyStore } from "@/store/currencyStore";

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
  account?: Account;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  open,
  onClose,
  account,
}) => {
  const accountStore = useAccountStore();
  const currencyStore = useCurrencyStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccountType, setSelectedAccountType] = useState<string>();
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const accountTypes: AccountType[] = accountStore.accountTypes || [];
  const currencies: Currency[] = currencyStore.currencies || [];

  // Pre-fill form when editing
  useEffect(() => {
    if (account) {
      setName(account.name);
      setDescription(account.description ?? "");
      setSelectedAccountType(account.type?.id?.toString() ?? "");
      setSelectedCurrency(account.currencyCode?.code ?? "");
    } else {
      setName("");
      setDescription("");
      setSelectedAccountType("");
      setSelectedCurrency("");
    }
    setErrors({});
  }, [account, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Account name is required";
    if (!selectedAccountType) newErrors.accountType = "Select an account type";
    if (!selectedCurrency) newErrors.currency = "Select a currency";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (account) {
      // Update mode — exclude initialBalance
      const updateData = {
        name,
        description,
        accountTypeId: Number(selectedAccountType),
        currencyCode: selectedCurrency!,
      };
      await accountStore.updateAccount(account.id, updateData);
    } else {
      // Create mode — include initialBalance
      const createData = {
        name,
        description,
        initialBalance: 0,
        accountTypeId: Number(selectedAccountType),
        currencyCode: selectedCurrency!,
      };
      await accountStore.createAccount(createData);
      await accountStore.getAccountsWithAccess();
    }

    onClose();
  };

  const handleDeleteConfirm = async () => {
    if (account) {
      await accountStore.deleteAccount(account.id);
      await accountStore.getMyAccounts();
      await accountStore.getAccountsWithAccess();
      setIsDeleteDialogOpen(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="bg-background p-6 rounded-2xl w-full max-w-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {account ? "Edit Account" : "Create Account"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Account Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Account Type */}
            <div>
              <Label>Account Type</Label>
              <Select
                value={selectedAccountType || ""}
                onValueChange={(val) => setSelectedAccountType(val)}
              >
                <SelectTrigger
                  className={errors.accountType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountType}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <Label>Currency</Label>
              <Select
                value={selectedCurrency || ""}
                onValueChange={(val) => setSelectedCurrency(val)}
              >
                <SelectTrigger
                  className={errors.currency ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              {account && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{account ? "Update" : "Create"}</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-background p-6 rounded-2xl w-full max-w-sm shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the account <b>{account?.name}</b>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Yes, Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
