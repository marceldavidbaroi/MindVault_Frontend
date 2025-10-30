"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore"; // or your user store
import { useUserStore } from "@/store/userStore";

interface UpdateProfileModalProps {
  open: boolean;
  onClose?: () => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  open,
  onClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(open);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser } = useAuthStore();
  const userStore = useUserStore();

  // Sync internal open state and user email
  useEffect(() => {
    setInternalOpen(open);
    if (open) {
      setEmail(user?.email || "");
      setError(""); // reset error on open
    }
  }, [open, user?.email]);

  const handleClose = () => {
    setInternalOpen(false);
    setEmail(user?.email || ""); // reset form
    setError(""); // clear error
    onClose?.();
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleUpdate = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await userStore.updateProfile({ email }); // assume this returns a promise

      toast.success("Profile updated successfully!");
      setUser({ ...user, email }); // update user in store
      handleClose(); // close modal and reset
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={internalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your email address below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // reset error on change
            }}
            disabled={loading}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleUpdate} disabled={loading || !email}>
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
