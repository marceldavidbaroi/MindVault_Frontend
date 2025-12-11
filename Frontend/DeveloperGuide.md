# 🧑‍💻 MindVault Frontend — Developer Guide

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure & Naming Conventions](#2-folder-structure--naming-conventions)

   - [2.1 App Directory (`app/`)](#21-app-directory-app)
   - [2.2 Components (`components/`)](#22-components-components)
   - [2.3 Lib & Utils](#23-lib--utils)
   - [2.4 Store (Zustand)](#24-store-zustand)
   - [2.5 Composables](#25-composables)
   - [2.6 Config & Constants](#26-config--constants)
   - [2.7 Pages & Dialogs](#27-pages--dialogs)
   - [2.8 CSS & Tailwind](#28-css--tailwind)
   - [2.9 API Calls](#29-api-calls)
   - [2.10 Naming Summary](#210-naming-summary)
   - [2.11 Best Practices](#211-best-practices)
   - [2.12 Initial Data Provider](#212-initial-data-provider)
   - [2.13 Global API Response Toast (`ApiResponseToast`)](#213-global-api-response-toast-apiresponsetoast)

---

## 1. Project Overview

MindVault is a **Finance + Auth + Productivity web app** built with **Next.js (app directory)** and **TypeScript**.

- **Environment**:

  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
  ```

- **Run Locally**:

  ```bash
  npm install
  npm run dev
  ```

- **Backend**: Next.js API routes (`/api/v1`)

- **Tech Stack**: Next.js, TypeScript, TailwindCSS, ShadCN components, Lucide icons, Zustand for state management, Sonner for notifications, and composables/hooks for reusable state logic.

---

## 2. Folder Structure & Naming Conventions

### 2.1 App Directory (`app/`)

- **Pages**: Use `page.tsx` for page components.
- **Layouts**: Use `layout.tsx` for layouts.
- **Protected Pages**: Inside `(protected)/<module>` folder.
- **Naming**:

  - Page components → `page.tsx`
  - Main component for page → `Index.tsx` (optional)
  - Child components in pages → descriptive name (e.g., `List`, `Card`, `Panel`)
  - Dialogs → `<EntityName>FormDialog.tsx` (handles both Create/Edit)
  - Modals → `Modal` suffix (e.g., `ConfirmDeleteModal.tsx`)
  - Recycle/Trash pages → `Recycle/page.tsx`

**Example**:

```
app/
  (protected)/
    finance/
      accounts/
        page.tsx
        AccountList.tsx
      transaction/
        page.tsx
```

---

### 2.2 Components (`components/`)

- Components should **live under their domain** folder (`accounts`, `finance`, `tags`, etc.).
- Shared/common components → `components/common/` (modals, tables, pagination, etc.)
- UI primitives → `components/ui/` (buttons, cards, input fields)
- Naming:

  - Lists → `EntityList.tsx`
  - Index components → `EntityIndex.tsx`
  - Modals → `Modal` suffix
  - Dialogs → `FormDialog` suffix

- **ShadCN + Lucide**:

  - All components **must use ShadCN** UI components wherever possible.
  - Icons **must use Lucide**.

**Glass effect**: `bg-background/60` + `backdrop-blur-md`
**Theme Colors**: Always use Tailwind theme colors.

---

### 2.3 Lib & Utils

**Purpose**:

- `lib/` → framework-level helpers, fetcher, cross-module utilities.
- `utils/` → pure utility functions. Separate **global** vs **module-specific**.

**Structure**:

```
lib/
  fetcher.ts

utils/
  global/
    formatDate.ts
    validateEmail.ts
  finance/
    transactionUtils.ts
    accountUtils.ts
  tags/
    tagHelpers.ts
```

**Rules**:

1. Global utilities → `utils/global/`
2. Module-specific utilities → `utils/<module>/`
3. Use `lib/` for fetcher or framework helpers
4. Always import from `@/utils/...` or `@/lib/...` for clarity

**Usage Example**:

```ts
import { fetcher } from "@/lib/fetcher";
import { calculateBalance } from "@/utils/finance/transactionUtils";
```

---

### 2.4 Store (Zustand)

- All **client-side API calls** should go through the store.
- Store **holds only data**, not full API response (success/message).
- Meta can be stored for paginated data.
- All store actions return:

```ts
{
  success: boolean;
  message: string;
  data: T;
}
```

- Local component state can manage filtered or grouped data.

**Example: Transaction Store**

```ts
const res = await store.createTransaction(dto);
if (res.success) setLocalData(res.data);
```

---

### 2.5 Composables

- Reusable hooks for state or domain logic.
- Must be grouped by domain: `composables/finance`, `composables/accounts`, etc.
- Can manage internal state but should not replace store data.

---

### 2.6 Config & Constants

**Config**:

- `config/api/` → API endpoints grouped by domain
- `config/index.ts` → global configs

**Constants**:

- `constants/` → icons, enumerations, color mappings, etc.
- **Navigation config** → `constants/navConfig.ts`
  SubItems for subpages
- Each route should include `title`, `href`, and `description`.

**Example**:

```ts
export const navConfig: NavItem[] = [
  {
    title: "About",
    subItems: [
      { title: "App Overview", href: "/about/app-overview" },
      { title: "Tags", href: "/tags" },
    ],
  },
];
```

---

### 2.7 Pages & Dialogs

- **Pages** → `page.tsx`
- **Main components** → `Index.tsx`
- **Lists** → `List.tsx`
- **Forms (Create/Edit)** → `<EntityName>FormDialog.tsx`
- **Modals** → `<EntityName>Modal.tsx` (inline preferred)
- Recycle/Trash pages → separate folder `/recycle/page.tsx`

---

### 2.8 CSS & Tailwind

- Use **theme colors**.
- Glass effect: `bg-background/60` + `backdrop-blur-md`
- Tailwind utilities via `tw-variants` allowed
- Global CSS in `globals.css`
- No inline CSS except for dynamic values (e.g., tag colors)

---

### 2.9 API Calls

- Must go through `store` using `lib/fetcher`.
- Always return `{ success, message, data }`.
- Store should hold only `data` and optionally `meta`.
- Local component state handles filtered/grouped views.

---

### 2.10 Naming Summary

| Entity                | Suffix / Prefix      | Notes                                                                    |
| --------------------- | -------------------- | ------------------------------------------------------------------------ |
| Page                  | `page.tsx`           | Main page component                                                      |
| Main page component   | `Index.tsx`          | Optional wrapper                                                         |
| Lists                 | `List.tsx`           | Items in page/component                                                  |
| Dialogs (Create/Edit) | `FormDialog.tsx`     | Handles both Create & Edit                                               |
| Modals                | `Modal.tsx`          | Inline in components                                                     |
| Index Components      | `Index.tsx`          | For main component inside domain folder                                  |
| Utilities             | `utils/global/...`   | Global pure functions                                                    |
| Module Utilities      | `utils/<module>/...` | Domain-specific helpers                                                  |
| Store                 | `<Entity>Store.ts`   | Holds only data & meta, actions return full `{ success, message, data }` |
| Components UI         | `ui/`                | ShadCN + Lucide icons mandatory                                          |

---

### 2.11 Best Practices

1. Always fetch data via **store**.
2. Local component state manages view-specific data (sorting, grouping, filtering).
3. Use **ShadCN + Lucide** for all UI.
4. All Tailwind classes should respect theme colors.
5. Modals/dialogs should be inline in component, unless highly reusable.
6. Navigation routes managed in `constants/navConfig.ts`.
7. Utility logic split into `lib/` (framework) vs `utils/` (pure logic).

---

### 2.12 Initial Data Provider

For **centralized app bootstrap data fetching**, see the dedicated guide:

📄 [`InitialDataProvider` Cheat Sheet](../Frontend/app//InitialDataProvider.readme.md)

- Ensures **all global and user-related data** is fetched before UI renders.
- Handles **loading state** and **error management**.
- Ideal for fetching **profile, roles, tags, settings, notifications**, and other critical global data.
- Should wrap the **entire app** to prevent incomplete renders.

---

### 2.13 Global API Response Toast (`ApiResponseToast`)

**Purpose:**
Displays **success or error notifications** for all API calls throughout the app using the `Sonner` toast library.

**How It Works:**

1. The **Zustand `notificationStore`** holds a single `response` object:

```ts
interface ApiResponseNotification {
  success: boolean;
  message?: string;
}
```

2. Any API call using the **universal `fetcher`** sets `response` in the store:

- Success → `toast.success(message)`
- Error → `toast.error(message)`

3. The **`ApiResponseToast` component** listens to the store and automatically shows a toast whenever `response` is updated. It resets the store afterward to prevent repeated notifications.

**Integration:**

- Already wrapped in `RootLayout` → **all pages/components automatically show notifications**.
- Position, style, and behavior can be customized directly in `components/ApiResponseToast.tsx`:

```tsx
<Toaster
  position="bottom-left" // adjust to top-right, top-left, etc.
  richColors
  closeButton
  expand
  toastOptions={{ duration: 4000 }}
/>
```

**Developer Notes:**

- **Changing the position or style:** Edit the `<Toaster />` props in `ApiResponseToast.tsx`.
- **Adding custom behavior:** Wrap or replace `toast.success` / `toast.error` calls as needed.
- **Store usage:** Can manually trigger notifications anywhere by importing `useNotificationStore`:

```ts
useNotificationStore
  .getState()
  .setResponse({ success: true, message: "Custom message" });
```

**Summary:**
`ApiResponseToast` is a **centralized notification system** for API responses. Developers can tweak **position, appearance, and behavior** without changing API calls.
