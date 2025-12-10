# 🔹 `fetcher` Cheat Sheet

## **Purpose**

- Universal fetch wrapper for **client + SSR/server components**.
- Automatically handles:

  - Cookies (`credentials: "include"`)
  - 401 → token refresh + retry
  - Success/error notifications via `notificationStore`

---

## **1. Client-side Fetch**

```ts
import { fetcher } from "@/lib/fetcher";

async function loadUser() {
  try {
    const user = await fetcher("/auth/me"); // cookies auto-sent
    console.log(user);
  } catch (err) {
    console.error(err);
  }
}
```

---

## **2. Server-side / SSR Fetch**

```ts
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";

const cookieHeader = cookies()
  .getAll()
  .map((c) => `${c.name}=${c.value}`)
  .join("; ");

const data = await fetcher("/summary/transaction-dashboard", {
  method: "GET",
  headers: { cookie: cookieHeader },
  cache: "no-store", // optional
});
```

✅ **Manual cookie forwarding is required** for server-side requests.

---

## **3. Custom Request Options**

```ts
await fetcher("/finance/accounts", {
  method: "POST",
  body: JSON.stringify({ name: "Savings Account" }),
  headers: { "X-Custom-Header": "value" },
});
```

- Supports all `fetch` options: `method`, `body`, `headers`, `cache`, etc.

---

## **4. Automatic 401 Handling**

- On 401:

  1. Calls `/auth/refresh`
  2. Retries original request

- If refresh fails → triggers notification:
  `"Session expired. Please log in again."`

---

## **5. Notifications**

- Success and error messages are handled automatically:

```ts
useNotificationStore.getState().setResponse({
  success: false,
  message: "Something went wrong",
});
```

---

## **6. Quick Features Summary**

| Feature              | Client | SSR/Server | Notes                                |
| -------------------- | :----: | :--------: | ------------------------------------ |
| Cookie handling      |   ✅   |     ✅     | Manual for SSR                       |
| Auto 401 refresh     |   ✅   |     ✅     | Uses `/auth/refresh`                 |
| Notifications        |   ✅   |     ✅     | `notificationStore`                  |
| Custom fetch options |   ✅   |     ✅     | Supports `method`, `body`, `headers` |

---

### **Recommended**

- Use `fetcher` for **all API calls** for consistent behavior.
- Always forward cookies on SSR/server requests.
- Do not call `fetch` directly unless for non-auth endpoints.
