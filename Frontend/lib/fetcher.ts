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
  req?: any // SSR request object
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Forward cookies for SSR
  if (req?.headers?.cookie) {
    headers["cookie"] = req.headers.cookie;
  }

  const res = await fetch(API_BASE_URL + url, {
    ...options,
    headers,
    credentials: "include", // send cookies automatically in client-side requests
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
