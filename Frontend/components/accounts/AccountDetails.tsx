"use client";

import React, { useEffect, useState } from "react";
import { useAccountStore } from "@/store/accountStore";
import { useRoleStore } from "@/store/rolesStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AccountDetailsSkeleton from "./skeleton/AccountDetailsSkeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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

  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    accountTypeId: "",
    currencyCode: "",
  });

  const [showDeleteDialog, setShowDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
  }>({ open: false, userId: null });
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newUserId, setNewUserId] = useState<number | null>(null);
  const [newRoleId, setNewRoleId] = useState<number | null>(null);

  const getAccountDetails = async () => {
    setLoading(true);

    // Fetch all data in parallel
    const [accountRes, roleRes, accountTypesRes, currenciesRes] =
      await Promise.all([
        accountStore.getAccount(id),
        roleStore.getAllRoles(),
        accountStore.getAllAccountTypes(),
        currencyStore.getAllCurrencies(),
      ]);

    setAccount(accountRes?.data);
    setRoles(roleRes?.data || []);
    setAccountTypes(accountTypesRes?.data || []);
    setCurrencies(currenciesRes?.data || []);

    setLoading(false);
  };

  useEffect(() => {
    getAccountDetails();
  }, [id]);

  const refreshAccount = async () => {
    const updated = await accountStore.getAccount(id);
    setAccount(updated?.data);
  };

  // Account edit handlers
  const handleEditAccount = () => {
    if (!account) return;
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
    if (!account) return;
    await accountStore.updateAccount(account.id, {
      name: editForm.name,
      description: editForm.description,
      accountTypeId: Number(editForm.accountTypeId),
      currencyCode: editForm.currencyCode,
    });
    await refreshAccount();
    setEditingAccount(false);
  };

  // Role editing handlers
  const handleEditRole = (userId: number, currentRoleId: number) => {
    setEditingRoleId(userId);
    setSelectedRoleId(currentRoleId);
  };
  const handleCancelEditRole = () => {
    setEditingRoleId(null);
    setSelectedRoleId(null);
  };
  const handleSaveRole = async (userId: number) => {
    if (!selectedRoleId) return;
    await accountStore.updateAccountRole(id, userId, {
      roleId: selectedRoleId,
    });
    await refreshAccount();
    setEditingRoleId(null);
  };
  const handleDeleteRole = (userId: number) =>
    setShowDeleteDialog({ open: true, userId });
  const confirmDeleteRole = async () => {
    if (showDeleteDialog.userId) {
      await accountStore.removeAccountRole(id, showDeleteDialog.userId);
      await refreshAccount();
    }
    setShowDeleteDialog({ open: false, userId: null });
  };

  // Add member handlers
  const handleAddMember = () => {
    setShowAddMemberDialog(true);
    setNewUserId(null);
    setNewRoleId(null);
  };
  const handleSaveNewMember = async () => {
    if (newUserId && newRoleId) {
      await accountStore.assignAccountRole(id, {
        userId: newUserId,
        roleId: newRoleId,
      });
      await getAccountDetails();
    }
    setShowAddMemberDialog(false);
  };

  if (loading) return <AccountDetailsSkeleton />;
  if (!account)
    return (
      <div className="text-center text-muted-foreground">No account found</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Account Info */}
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
                  {account.name}
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSaveAccount}
                >
                  <Check className="h-4 w-4" />
                </Button>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEditAccount}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => accountStore.deleteAccount(account.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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

      {/* Account Members */}
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-foreground">
            Account Members
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddMember}>
            <Plus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {account.users?.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No members assigned to this account.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {account.users.map((u: any) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between py-3 px-1 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{u.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.email || "No email"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {editingRoleId === u.id ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedRoleId ? String(selectedRoleId) : ""}
                          onValueChange={(val) =>
                            setSelectedRoleId(Number(val))
                          }
                        >
                          <SelectTrigger className="w-[160px] bg-white/10 border-white/30">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-lg">
                            {roles.map((r) => (
                              <SelectItem key={r.id} value={String(r.id)}>
                                {r.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleSaveRole(u.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEditRole}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {u.role.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.role.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditRole(u.id, u.role.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteRole(u.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog
        open={showDeleteDialog.open}
        onOpenChange={(open) =>
          setShowDeleteDialog({ open, userId: showDeleteDialog.userId })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this member from the account?</p>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog({ open: false, userId: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRole}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <Input
              type="number"
              placeholder="User ID"
              value={newUserId ?? ""}
              onChange={(e) => setNewUserId(Number(e.target.value))}
            />
            <Select
              value={newRoleId ? String(newRoleId) : ""}
              onValueChange={(val) => setNewRoleId(Number(val))}
            >
              <SelectTrigger className="w-full bg-white/10 border-white/30">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-lg">
                {roles.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddMemberDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewMember}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountDetails;
