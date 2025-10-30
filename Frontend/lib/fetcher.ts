import { API_BASE_URL } from "@/config/api";
import { useNotificationStore } from "@/store/notificationStore";

/**
 * 🔹 Universal Fetch Wrapper (Client + SSR / Server Components)
 *
 * - Automatically attaches `credentials: "include"` for cookie-based auth in client requests.
 * - For SSR or server components (App Router), forward cookies manually using `next/headers` or `req.headers.cookie`.
 * - Centralizes all API calls in one place.
 *
 * ✅ Client-side usage:
 *    import { fetcher } from "@/lib/fetcher";
 *    const user = await fetcher("/auth/me"); // browser automatically sends cookies
 *
 * ✅ App Router Server Component (SSR) usage:
 *    import { cookies } from "next/headers";
 *    import { fetcher } from "@/lib/fetcher";
 *
 *    const cookieStore = cookies();
 *    const cookieHeader = cookieStore
 *      .getAll()
 *      .map(c => `${c.name}=${c.value}`)
 *      .join("; ");
 *
 *    const data = await fetcher("/summary/transaction-dashboard", {
 *      method: "GET",
 *      headers: {
 *        cookie: cookieHeader, // forward cookies to backend
 *      },
 *      cache: "no-store",
 *    });
 *
 *
 */

export async function fetcher<T>(
  url: string,
  options: RequestInit = {},
  req?: any
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (req?.headers?.cookie) headers["cookie"] = req.headers.cookie;

  const fullUrl = API_BASE_URL + url;
  const { setResponse } = useNotificationStore.getState(); // notification setter

  let res: Response;

  try {
    res = await fetch(fullUrl, { ...options, headers, credentials: "include" });

    // Auto-refresh on 401
    if (res.status === 401) {
      try {
        const refreshHeaders: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (req?.headers?.cookie) refreshHeaders["cookie"] = req.headers.cookie;

        const refreshRes = await fetch(API_BASE_URL + "/auth/refresh", {
          method: "POST",
          headers: refreshHeaders,
        });

        if (!refreshRes.ok)
          throw new Error("Session expired. Please log in again.");

        // retry original request
        res = await fetch(fullUrl, {
          ...options,
          headers,
          credentials: "include",
        });
      } catch (err: any) {
        setResponse({
          success: false,
          message: err.message || "Session expired. Please log in again.",
        });
        throw err;
      }
    }

    if (!res.ok) {
      let msg: string;
      try {
        const errorData = await res.json(); // parse JSON error
        msg = errorData?.message || `API error: ${res.status}`;
      } catch {
        msg = await res.text(); // fallback to text
      }

      setResponse({
        success: false,
        message: msg,
      });

      throw new Error(msg);
    }

    const data = await res.json();
    if (data?.message) setResponse({ success: true, message: data.message }); // success message
    return data;
  } catch (err: any) {
    setResponse({
      success: false,
      message: err.message || "Something went wrong",
    });
    throw err;
  }
}
