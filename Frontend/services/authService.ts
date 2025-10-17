import { fetcher } from "@/lib/fetcher";
import { ENDPOINTS } from "@/config/api";

export const authService = {
  signin: (username: string, password: string) =>
    fetcher<any>(ENDPOINTS.auth.signin, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => {
    fetcher<any>(ENDPOINTS.auth.logout, {
      method: "POST",
      credentials: "include",
    });
  },

  //   me: (req?: any) => fetcher<any>(ENDPOINTS.auth.me, { method: "GET" }, req),
};
