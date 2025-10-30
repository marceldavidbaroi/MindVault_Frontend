"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/types/User.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User2, Key, Shield } from "lucide-react"; // Lucide icons
import { useUserStore } from "@/store/userStore";
import ShowPasskeyModal from "./dialogs/showPasskeyModal";

interface UserIndexProps {
  user: User;
}

const UserIndex = ({ user }: UserIndexProps) => {
  const userStore = useUserStore();

  useEffect(() => {
    userStore.setUser(user);
  }, [user]);

  const [showPass, setShowPass] = useState<boolean>(false);

  const handleUpdateProfile = () =>
    console.log("Update profile clicked for", userStore.user?.username);
  const handleShowPasskey = () => {
    setShowPass(true);
  };
  const handleAddOrEditSecurityQuestion = () =>
    console.log(
      userStore.user?.hasSecurityQuestions
        ? "Update security questions clicked"
        : "Add security questions clicked"
    );

  return (
    <div className="space-y-12 p-8 bg-background rounded-lg">
      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <User2 className="w-6 h-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold text-muted-foreground">
            Profile Details
          </h2>
        </div>
        <hr className="border-muted my-2" />
        <div className="flex flex-col space-y-1">
          <span className="text-lg font-bold">{userStore.user?.username}</span>
          <span className="text-lg font-semibold text-muted-foreground">
            {userStore.user?.email}
          </span>
          <div className="text-sm text-muted-foreground">
            Member since:{" "}
            {format(userStore.user?.createdAt || new Date(), "MMMM d, yyyy")}
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated:{" "}
            {format(userStore.user?.updatedAt || new Date(), "MMMM d, yyyy")}
          </div>
        </div>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
          onClick={handleUpdateProfile}
        >
          <User2 className="w-4 h-4" />
          Update Profile
        </Button>
      </section>
      {/* Security Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold text-muted-foreground">Security</h2>
        </div>
        <hr className="border-muted my-2" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            You can use your hash key to reset your password in case you forget
            it. Store it safely and do not share with anyone.
          </p>
          <div className="flex">
            <Button
              size="sm"
              variant="outline"
              className=" text-primary  flex items-center gap-1"
              onClick={handleShowPasskey}
            >
              <Key className="w-4 h-4" />
              {showPass ? "Hide Passkey" : "Show Passkey"}
            </Button>
            {/* {showPass && (
              <div className="text-primary bg-grey font-bold ">
                {userStore.passkey}
              </div>
            )} */}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            If you lost your passkey, set up up to three security questions to
            recover your account.
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
              onClick={handleAddOrEditSecurityQuestion}
            >
              <Shield className="w-4 h-4" />
              {userStore.user?.hasSecurityQuestions
                ? "Update Security Questions"
                : "Add Security Questions"}
            </Button>
            {userStore.user?.hasSecurityQuestions && (
              <Badge variant="outline">Set</Badge>
            )}
          </div>
        </div>
      </section>
      <ShowPasskeyModal open={showPass} onClose={() => setShowPass(false)} />
    </div>
  );
};

export default UserIndex;
