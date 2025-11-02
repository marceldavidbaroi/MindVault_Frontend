"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/store/userStore";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const userStore = useUserStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const rules = {
    length: newPassword.length >= 6 && newPassword.length <= 50,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    specialChar: /[@$!%*?&]/.test(newPassword),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleSubmit = async () => {
    if (!oldPassword) {
      toast.error("Old password is required.");
      return;
    }
    if (!isPasswordValid) {
      toast.error("New password does not meet the requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    console.log({
      oldPassword,
      newPassword,
    });
    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    await userStore.changePassword(payload);

    handleClose();
  };

  const handleClose = () => {
    // Reset all fields and visibility toggles
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (value: string) => void,
    showPassword: boolean,
    setShowPassword: (value: boolean) => void
  ) => (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {renderPasswordInput(
            "Old Password",
            oldPassword,
            setOldPassword,
            showOldPassword,
            setShowOldPassword
          )}
          <div>
            {renderPasswordInput(
              "New Password",
              newPassword,
              setNewPassword,
              showNewPassword,
              setShowNewPassword
            )}
            <ul className="mt-2 text-sm space-y-1 text-muted-foreground">
              <li
                className={clsx(
                  rules.length ? "text-green-600" : "text-red-500"
                )}
              >
                • 6-50 characters
              </li>
              <li
                className={clsx(
                  rules.uppercase ? "text-green-600" : "text-red-500"
                )}
              >
                • Contains uppercase letter
              </li>
              <li
                className={clsx(
                  rules.lowercase ? "text-green-600" : "text-red-500"
                )}
              >
                • Contains lowercase letter
              </li>
              <li
                className={clsx(
                  rules.number ? "text-green-600" : "text-red-500"
                )}
              >
                • Contains a number
              </li>
              <li
                className={clsx(
                  rules.specialChar ? "text-green-600" : "text-red-500"
                )}
              >
                • Contains a special character (@$!%*?&)
              </li>
            </ul>
          </div>
          {renderPasswordInput(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            setShowConfirmPassword
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary"
            disabled={!oldPassword || !isPasswordValid || !confirmPassword}
          >
            Update Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
