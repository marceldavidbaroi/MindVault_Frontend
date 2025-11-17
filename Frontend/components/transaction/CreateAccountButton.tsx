"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateAccountButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/finance/accounts");
  };

  return (
    <Button
      onClick={handleClick}
      className="
        mt-4
        bg-primary backdrop-blur-md border border-primary/40
        text-white font-semibold
        px-6 py-2
        shadow-md
      "
    >
      Create Account
    </Button>
  );
}
