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
import { Loader2, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

interface ShowPasskeyModalProps {
  open: boolean;
  onClose?: () => void;
}

const ShowPasskeyModal = ({ open, onClose }: ShowPasskeyModalProps) => {
  const [internalOpen, setInternalOpen] = useState(open);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const userStore = useUserStore();

  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const handleClose = () => {
    setInternalOpen(false);
    setPassword("");
    setShowPasskey(false);
    onClose?.();
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      await userStore.getPasskey({ password });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (userStore.passkey) {
      await navigator.clipboard.writeText(userStore.passkey);
      toast.success("Passkey copied to clipboard");
    }
  };

  return (
    <Dialog open={internalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-800">
            Verify Your Password
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Enter your password to view your passkey securely.
          </DialogDescription>
        </DialogHeader>

        {!userStore.passkey ? (
          <>
            <div className="mt-4">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
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
              <Button
                size="sm"
                onClick={handleVerify}
                disabled={!password || loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Show"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2 font-mono text-sm">
              <span>
                {showPasskey
                  ? userStore.passkey
                  : "•••••••••••••••••••••••••••••"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowPasskey(!showPasskey)}
                >
                  {showPasskey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowPasskeyModal;
