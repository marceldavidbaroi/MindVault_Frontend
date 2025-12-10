# 🟢 API Endpoint Constants Guidelines

### 1. File & Naming

- File: `apiEndpoints.ts` or `<entity>Endpoints.ts`
- Constant name: `<ENTITY>_ENDPOINTS` (uppercase with `_`)
- Nested objects for related sub-resources (e.g., roles, types).
- Functions for endpoints that require **IDs or params**.

---

### 2. Structure

```ts
export const <ENTITY>_ENDPOINTS = {
  /** Basic CRUD */
  create: "/<base-path>",
  getAll: "/<base-path>",        // optional
  getOne: (id: number | string) => `/base-path/${id}`,
  update: (id: number | string) => `/base-path/${id}`,
  remove: (id: number | string) => `/base-path/${id}`,

  /** Sub-resources */
  subResource: {
    list: (parentId: number | string) => `/base-path/${parentId}/sub`,
    create: (parentId: number | string) => `/base-path/${parentId}/sub`,
    update: (parentId: number | string, id: number | string) =>
      `/base-path/${parentId}/sub/${id}`,
    remove: (parentId: number | string, id: number | string) =>
      `/base-path/${parentId}/sub/${id}`,
  },

  /** Additional endpoints */
  stats: "/base-path/stats",     // optional
};
```

---

### 3. Best Practices

1. **Group by entity**: One constant per entity.
2. **Use functions** for dynamic paths (IDs, params).
3. **Nest related resources** (roles, types, sub-collections) in objects.
4. **Keep paths centralized** for consistency across services.
5. **Follow consistent naming** for CRUD: `create`, `getOne`, `update`, `remove`, `list`, `stats`.

---

### 4. Example: Accounts, Categories, Savings Goals

```ts
export const ACCOUNTS_ENDPOINTS = {
  create: "/finance/accounts",
  my: "/finance/accounts/my",
  access: "/finance/accounts/access",
  getOne: (id: number | string) => `/finance/accounts/${id}`,
  update: (id: number | string) => `/finance/accounts/${id}`,
  remove: (id: number | string) => `/finance/accounts/${id}`,
  types: { all: "/finance/accounts/types/all" },
  roles: {
    currentRole: (id: number | string) => `/finance/accounts/${id}/role`,
    assign: (id: number | string) => `/finance/accounts/${id}/roles`,
    list: (id: number | string) => `/finance/accounts/${id}/roles`,
    update: (id: number | string, userId: number | string) =>
      `/finance/accounts/${id}/roles/${userId}`,
    remove: (id: number | string, userId: number | string) =>
      `/finance/accounts/${id}/roles/${userId}`,
  },
};

export const CATEGORY_ENDPOINTS = {
  all: "/finance/categories",
  getOne: (id: number | string) => `/finance/categories/${id}`,
  create: "/finance/categories",
  update: (id: number | string) => `/finance/categories/${id}`,
  remove: (id: number | string) => `/finance/categories/${id}`,
  stats: "/finance/categories/stats/all",
};

export const SAVINGS_GOALS_ENDPOINTS = {
  create: "/finance/savings-goals",
  my: "/finance/savings-goals/my",
  getOne: (id: number | string) => `/finance/savings-goals/${id}`,
  update: (id: number | string) => `/finance/savings-goals/${id}`,
  remove: (id: number | string) => `/finance/savings-goals/${id}`,
};
```

---

✅ **Summary**

- Centralize all API paths per entity.
- Use **functions for dynamic segments**.
- Nest sub-resources logically.
- Keep CRUD naming consistent (`create`, `getOne`, `update`, `remove`).
- Optional endpoints (`stats`, `my`, etc.) go alongside CRUD.
