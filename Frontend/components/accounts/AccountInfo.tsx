"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAccountStore } from "@/store/accountStore";

interface AccountInfoProps {
  account: any;
  roles?: any[];
  accountTypes: any[];
  currencies: any[];
  refreshAccount: () => void;
  permissions: {
    isOwner: boolean;
    isOwnerOrAdmin: boolean;
    canEdit: boolean;
  };
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  account,
  accountTypes,
  currencies,
  refreshAccount,
  permissions,
}) => {
  const accountStore = useAccountStore();
  const router = useRouter();

  const [editingAccount, setEditingAccount] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    accountTypeId: "",
    currencyCode: "",
  });

  const handleEditAccount = () => {
    setEditingAccount(true);
    setEditForm({
      name: account.name,
      description: account.description || "",
      accountTypeId: account.type?.id?.toString() || "",
      currencyCode: account.currencyCode?.code || "",
    });
  };

  const handleCancelEditAccount = () => setEditingAccount(false);

  const handleSaveAccount = async () => {
    await accountStore.updateAccount(account.id, {
      name: editForm.name,
      description: editForm.description,
      accountTypeId: Number(editForm.accountTypeId),
      currencyCode: editForm.currencyCode,
    });
    await refreshAccount();
    setEditingAccount(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await accountStore.deleteAccount(account.id);
      router.push("/finance/accounts/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <div className="flex-1 space-y-1">
            {editingAccount ? (
              <div className="space-y-2">
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Account Name"
                  className="bg-white/10 border-white/30"
                />
                <Input
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Description"
                  className="bg-white/10 border-white/30"
                />
                <Select
                  value={editForm.accountTypeId}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, accountTypeId: val })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/30">
                    <SelectValue placeholder="Select Account Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-lg">
                    {accountTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={editForm.currencyCode}
                  onValueChange={(val) =>
                    setEditForm({ ...editForm, currencyCode: val })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/30">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-lg">
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  #{account.id} {account.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {account.description || "No description provided"}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {editingAccount ? (
              <>
                {permissions.canEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSaveAccount}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEditAccount}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {permissions.canEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEditAccount}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {permissions.isOwner && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{account.type?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Currency</p>
            <p className="font-medium">
              {account.currencyCode?.symbol} {account.currencyCode?.name}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Balance</p>
            <p className="font-medium">
              {account.currencyCode?.symbol}
              {account.balance}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Owner ID</p>
            <p className="font-medium">{account.ownerId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {new Date(account.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Updated</p>
            <p className="font-medium">
              {new Date(account.updatedAt).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account "#{account.id}{" "}
              {account.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountInfo;
