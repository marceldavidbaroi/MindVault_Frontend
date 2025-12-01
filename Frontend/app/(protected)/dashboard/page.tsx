"use client";
import { useUserStore } from "@/store/userStore";
import React from "react";

const page = () => {
  const userStore = useUserStore();
  return (
    <div>
      {JSON.stringify(userStore.user)}
      this is the dashboard
    </div>
  );
};

export default page;
