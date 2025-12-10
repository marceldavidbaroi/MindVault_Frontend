# 🔹 `InitialDataProvider` Cheat Sheet

## **Purpose**

- Centralizes **initial app data fetching** at startup.
- Ensures the app has **all necessary data** before rendering child components.
- Prevents UI errors caused by missing or incomplete data.
- Provides a **loading screen with branding** for a smooth user experience.

---

## **What to Add / Fetch Here**

`InitialDataProvider` should fetch any **global or user-related data** required before the UI renders. Examples:

| Type of Data                 | Example / Action                                      |
| ---------------------------- | ----------------------------------------------------- |
| **User Profile**             | `userStore.getProfile()`                              |
| **User Roles / Permissions** | `roleStore.getAllRoles()`                             |
| **Tags / Categories**        | `tagStore.getAllTags({ includeSystem: true })`        |
| **Settings / Preferences**   | `settingsStore.getUserSettings()`                     |
| **Notifications**            | `notificationStore.getAll()`                          |
| **Other Global Data**        | Any module data that must be ready before app renders |

---

## **Implementation Tips**

- Use `Promise.all` for **parallel fetching** to reduce loading time.
- Track loading state with `useState` and set `loading` to false when all data is fetched.
- Keep **error handling** inside `try/catch` to avoid app crashes.
- Wrap the **entire app** in `InitialDataProvider` (already done).
- Show a **branded loader** while data is being fetched.

---

## **When to Extend**

Add new stores or APIs here if:

1. The data is **critical for the initial UI**.
2. Components **depend on it to render properly**.
3. It’s global data that **all pages/components may use**.

---

✅ **Summary**
`InitialDataProvider` is your **central app “bootstrapper”**: fetch everything essential at startup, prevent incomplete renders, and give users a smooth loading experience.
