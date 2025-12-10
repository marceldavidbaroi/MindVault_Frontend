import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";

export const authService = {
  signin: (username: string, password: string) =>
    fetcher<any>(API_ENDPOINTS.auth.signin, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  signup: (username: string, password: string) =>
    fetcher<any>(API_ENDPOINTS.auth.signup, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => {
    fetcher<any>(API_ENDPOINTS.auth.logout, {
      method: "POST",
      credentials: "include",
    });
  },

  //   me: (req?: any) => fetcher<any>(API_ENDPOINTS.auth.me, { method: "GET" }, req),
};
