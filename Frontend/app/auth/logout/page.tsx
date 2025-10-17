"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const LogoutPage = () => {
  const authStore = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authStore.logout();
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 1500);
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className=" flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Confirm Logout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center">
            Are you sure you want to logout? You will need to login again to
            access your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleGoBack} disabled={loading}>
            Go Back
          </Button>
          <Button onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LogoutPage;
