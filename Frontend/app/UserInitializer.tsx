"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRoleStore } from "@/store/rolesStore";
import { cn } from "@/lib/utils";

export function UserInitializer({ children }: { children: React.ReactNode }) {
  const userStore = useUserStore();
  const roleStore = useRoleStore();

  const [loading, setLoading] = useState(!userStore.initialized);

  // Async function to fetch all required data
  const initializeUser = async () => {
    setLoading(true);
    try {
      // Fetch roles and user profile concurrently
      await Promise.all([roleStore.getAllRoles(), userStore.getProfile()]);
    } catch (error) {
      console.error("Error initializing user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userStore.initialized) {
      initializeUser();
    }
  }, [userStore.initialized]);

  // Modern full-screen skeleton loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background gap-6 animate-pulse">
        {/* Spinner skeleton */}
        <div className={cn("w-16 h-16 rounded-full bg-chart-1/30")} />

        {/* Brand name with actual text and pulse */}
        <h1 className="text-6xl font-extrabold text-chart-1 select-none animate-pulse">
          MIND VAULT
        </h1>

        {/* Navigation menu skeleton */}
        <div className="flex gap-4 mt-8">
          <div className="w-24 h-9 rounded-md bg-chart-1/30" />
          <div className="w-24 h-9 rounded-md bg-chart-1/30" />
          <div className="w-24 h-9 rounded-md bg-chart-1/30" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
