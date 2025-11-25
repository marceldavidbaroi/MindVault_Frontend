// app/layout.tsx OR components/Layout.tsx
import React from "react";
import DynamicNavigationMenu from "@/components/navigation/DynamicNavigationMenu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

// 🔹 Mark layout as async
const Layout = async ({ children }: LayoutProps) => {
  // 🔹 Await cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // 🔹 Redirect if no access token
  if (!accessToken && !refreshToken) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Navbar section */}
      <DynamicNavigationMenu />
      {/* 🔹 Page content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
