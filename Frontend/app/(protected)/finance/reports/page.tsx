"use client";
import SummaryDashboardCards from "@/components/reports/SummaryDashboardCards";
import { useAccountStore } from "@/store/accountStore";
import React, { useEffect } from "react";

const ReportsPage = () => {
  const accountStore = useAccountStore();
  useEffect(() => {
    const init = async () => {
      await accountStore.getAccountsWithAccess();
    };
    init();
  }, []);
  return (
    <>
      <SummaryDashboardCards />
    </>
  );
};

export default ReportsPage;
