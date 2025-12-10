# 🟢 API Service Module Guidelines

### 1. File & Naming

- Service file: `<entity>Service.ts` (e.g., `accountService.ts`)
- Export a single object with **all API methods**.
- Use **PascalCase types** and **camelCase method names**.

---

### 2. Structure

```ts
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/config/api";
import { <Types> } from "@/types/<Entity>.type";
import { ApiResponse } from "@/types/ApiResponse.type";

export const <entity>Service = {
  /** GET all items */
  getAll: (params?: any) =>
    fetcher<ApiResponse<<Type>[]>>(
      `${API_ENDPOINTS.<entity>.all}${params ? "?" + new URLSearchParams(params).toString() : ""}`,
      { method: "GET" }
    ),

  /** GET single item by ID */
  getOne: (id: number) =>
    fetcher<ApiResponse<<Type>>>(API_ENDPOINTS.<entity>.getOne(id), { method: "GET" }),

  /** CREATE new item */
  create: (data: Create<Type>Dto) =>
    fetcher<ApiResponse<<Type>>>(API_ENDPOINTS.<entity>.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** UPDATE item by ID */
  update: (id: number, data: Partial<Create<Type>Dto>) =>
    fetcher<ApiResponse<<Type>>>(API_ENDPOINTS.<entity>.update(id), {
      method: "PUT", // or PATCH
      body: JSON.stringify(data),
    }),

  /** DELETE item by ID */
  remove: (id: number) =>
    fetcher<ApiResponse<null>>(API_ENDPOINTS.<entity>.remove(id), { method: "DELETE" }),
};
```

---

### 3. Best Practices

1. **Use a single exported object** per entity for all methods.
2. **Use generically typed `ApiResponse<T>`** for all responses.
3. **Handle query params** with `URLSearchParams` or a helper function.
4. **Follow CRUD naming**: `getAll`, `getOne`, `create`, `update`, `remove`.
5. **Add extra methods as needed**: e.g., `assignRole`, `getStats`, `restore`, `forceDelete`.
6. **Keep URLs centralized** in `API_ENDPOINTS`.
7. **Always stringify body for POST/PUT/PATCH requests.**

---

### 4. Optional Utilities

- **Query string helper:**

```ts
const toQueryString = (params: Record<string, any> = {}) =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
```

- Use it for `getAll` or filtered endpoints.

---

### 5. Example: Tag Service

```ts
export const tagService = {
  createTag: (data: any) =>
    fetcher(API_ENDPOINTS.tags.create, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllTags: (params?: Record<string, any>) => {
    const query = params ? `?${toQueryString(params)}` : "";
    return fetcher(`${API_ENDPOINTS.tags.getAll}${query}`, { method: "GET" });
  },
  getTag: (id: number) =>
    fetcher(API_ENDPOINTS.tags.getOne(id), { method: "GET" }),
  updateTag: (id: number, data: any) =>
    fetcher(API_ENDPOINTS.tags.update(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTag: (id: number) =>
    fetcher(API_ENDPOINTS.tags.delete(id), { method: "DELETE" }),
};
```

---

✅ **Summary**

- Centralize API URLs (`API_ENDPOINTS`).
- Keep one service object per entity.
- Follow consistent **CRUD naming patterns**.
- Use typed `ApiResponse<T>` for all responses.
- Include helper functions for query params and optional bulk operations.
