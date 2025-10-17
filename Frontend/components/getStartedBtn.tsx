"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const GetStartedBtn = () => {
  const router = useRouter();

  return (
    <Button
      size="lg"
      className="px-8 py-3 text-base rounded-xl font-medium"
      onClick={() => router.push("/dashboard")}
    >
      Get Started
    </Button>
  );
};

export default GetStartedBtn;
