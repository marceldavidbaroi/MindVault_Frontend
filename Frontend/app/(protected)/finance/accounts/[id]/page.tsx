"use client";
import AccountDetails from "@/components/accounts/AccountDetails";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AccountDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = params?.id ? Number(params.id) : undefined;

  // Redirect or show an error if id is invalid
  useEffect(() => {
    if (!id) {
      router.replace("/finance/accounts"); // redirect to account list
    }
  }, [id, router]);

  if (!id) return null; // or a loader

  return <AccountDetails id={id} />;
};

export default AccountDetailsPage;
