import { API_BASE_URL } from "@/config/api";

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

  if (req?.headers?.cookie) {
    headers["cookie"] = req.headers.cookie;
  }

  const fullUrl = API_BASE_URL + url;

  let res = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  });

  // 🔁 Auto-refresh on 401
  if (res.status === 401) {
    try {
      // Attempt to refresh
      const refreshRes = await fetch(API_BASE_URL + "/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        // Retry original request once
        res = await fetch(fullUrl, {
          ...options,
          headers,
          credentials: "include",
        });
      } else {
        throw new Error("Refresh token invalid");
      }
    } catch (err) {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `API error: ${res.status}`);
  }

  return res.json();
}
