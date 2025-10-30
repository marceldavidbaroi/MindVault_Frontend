import { create } from "zustand";

export interface ApiResponseNotification {
  success: boolean;
  message?: string;
}

interface NotificationState {
  response: ApiResponseNotification | null;
  setResponse: (res: ApiResponseNotification | null) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  response: null,
  setResponse: (res) => set({ response: res }), // ✅ wrap in object
}));
