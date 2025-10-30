"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store/userStore";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const userStore = useUserStore();

  const [username, setUsername] = useState("");
  const [passkey, setPasskey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasskey, setShowPasskey] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedPasskey, setGeneratedPasskey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);

    try {
      const response = await userStore.resetPasswordPasskey({
        username,
        passkey,
        newPassword,
      });

      // Show dialog with new passkey
      setGeneratedPasskey(response.data.newPasskey);
      setDialogOpen(true);
    } catch (error) {
      console.error("Password reset failed:", error);
      // Optional: show toast/error message
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMismatch(newPassword !== value);
  };

  const copyPasskey = () => {
    navigator.clipboard.writeText(generatedPasskey);
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your username, passkey, and set a new password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Passkey */}
            <div className="grid gap-2">
              <Label htmlFor="passkey">Passkey</Label>
              <div className="flex items-center space-x-0">
                <Input
                  id="passkey"
                  type={showPasskey ? "text" : "password"}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter your passkey"
                  required
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="rounded-l-none px-3"
                >
                  {showPasskey ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              <button
                type="button"
                className="text-sm text-right text-primary underline mt-1 self-end"
                onClick={() => router.push("/auth/questions")}
              >
                Forgot Passkey?
              </button>
            </div>

            {/* New Password */}
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="flex items-center space-x-0">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="rounded-l-none px-3"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="flex flex-col">
                <div className="flex items-center space-x-0">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    placeholder="Confirm new password"
                    required
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="rounded-l-none px-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                </div>
                {passwordMismatch && (
                  <p className="text-sm text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Reset Password
          </Button>

          {/* Back to Login */}
          <button
            type="button"
            className="text-sm text-center text-primary underline mt-2"
            onClick={() => router.push("/auth/sign-in")}
          >
            Back to Login
          </button>
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Passkey</DialogTitle>
            <DialogDescription>
              This is your new passkey. Copy and keep it safe.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mt-4 mb-4 p-2 border rounded">
            <span className="break-all">{generatedPasskey}</span>
            <Button variant="outline" size="sm" onClick={copyPasskey}>
              <Copy size={16} />
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => router.push("/auth/sign-in")}
              className="w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPasswordPage;
