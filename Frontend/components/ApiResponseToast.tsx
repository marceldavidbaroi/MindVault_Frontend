// components/ApiResponseToast.tsx
"use client";

import React, { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useNotificationStore } from "@/store/notificationStore";

export const ApiResponseToast = () => {
  const { response, setResponse } = useNotificationStore();

  useEffect(() => {
    if (!response) return;

    if (response.success) {
      toast.success(response.message || "Success");
    } else {
      toast.error(response.message || "Something went wrong");
    }

    // Reset the response after showing
    setResponse(null);
  }, [response, setResponse]);

  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand
      toastOptions={{
        duration: 4000,
      }}
    />
  );
};
