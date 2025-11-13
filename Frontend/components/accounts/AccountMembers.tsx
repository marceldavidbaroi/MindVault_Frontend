"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccountStore } from "@/store/accountStore";

interface AccountMembersProps {
  account: any;
  roles: any[];
  refreshAccount: () => void;
}

const AccountMembers: React.FC<AccountMembersProps> = ({
  account,
  roles,
  refreshAccount,
}) => {
  const accountStore = useAccountStore();

  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
  }>({ open: false, userId: null });

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newRoleId, setNewRoleId] = useState<number | null>(null);

  /** Role editing */
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
    await accountStore.updateAccountRole(account.id, userId, {
      roleId: selectedRoleId,
    });
    await refreshAccount();
    setEditingRoleId(null);
  };

  /** Role deletion */
  const handleDeleteRole = (userId: number) =>
    setShowDeleteDialog({ open: true, userId });
  const confirmDeleteRole = async () => {
    if (showDeleteDialog.userId) {
      await accountStore.removeAccountRole(account.id, showDeleteDialog.userId);
      await refreshAccount();
    }
    setShowDeleteDialog({ open: false, userId: null });
  };

  /** Add member */
  const handleAddMember = () => {
    setShowAddMemberDialog(true);
    setNewUsername("");
    setNewRoleId(null);
  };
  const handleSaveNewMember = async () => {
    if (!newUsername || !newRoleId) return;

    await accountStore.assignAccountRole(account.id, {
      username: newUsername, // using username instead of userId
      roleId: newRoleId,
    });

    await refreshAccount();
    setShowAddMemberDialog(false);
  };

  return (
    <>
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

      {/* Delete Dialog */}
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

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <Input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
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
    </>
  );
};

export default AccountMembers;
