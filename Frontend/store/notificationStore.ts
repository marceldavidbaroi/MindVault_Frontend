// store/notificationStore.ts
import { create } from "zustand";
import { ApiResponse } from "@/types/ApiResponse.type";

interface NotificationState {
  response: ApiResponse<any> | null;
  setResponse: (res: ApiResponse<any> | null) => void; // ✅ allow null
}

export const useNotificationStore = create<NotificationState>((set) => ({
  response: null,
  setResponse: (res) => set({ response: res }),
}));
