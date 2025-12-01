"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { useRoleStore } from "@/store/rolesStore";
import { cn } from "@/lib/utils";

export function UserInitializer({ children }: { children: React.ReactNode }) {
  const userStore = useUserStore();
  const roleStore = useRoleStore();

  const [loading, setLoading] = useState(!userStore.initialized);

  const initializeUser = async () => {
    setLoading(true);
    try {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background gap-6 animate-pulse select-none">
        {/* Logo */}
        <Image
          src="/MindVaultLogo.png"
          width={200}
          height={200}
          alt="MindVault Logo"
          className="opacity-90"
          priority
        />

        {/* Brand Name */}
        <h1 className="text-6xl font-extrabold text-chart-1 animate-pulse tracking-wide">
          Mind Vault{" "}
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}
