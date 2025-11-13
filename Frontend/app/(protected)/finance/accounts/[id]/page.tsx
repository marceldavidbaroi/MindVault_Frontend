"use client";
import AccountDetails from "@/components/accounts/AccountDetails";
import { useParams } from "next/navigation";
import React from "react";

const AccountDetailsPage = () => {
  const params = useParams();
  const { id } = params;
  return <AccountDetails id={id} />;
};

export default AccountDetailsPage;
