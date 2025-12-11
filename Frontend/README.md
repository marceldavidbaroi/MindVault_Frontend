# MindVault Frontend

**MindVault Frontend** is a **Finance + Auth + Productivity web app** built with **Next.js (App Router)** and **TypeScript**, providing a responsive, modular, and user-friendly interface for managing personal finance and productivity features.

The frontend communicates with the **MindVault Backend** API for authentication, data fetching, and operations.

---

## Table of Contents

1. [Repository](#repository)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Environment Variables](#environment-variables)
5. [Run Instructions](#run-instructions)
6. [Build & Production](#build--production)
7. [Folder Structure & Naming](#folder-structure--naming)
8. [Global Features](#global-features)
9. [Links](#links)

---

## Repository

- GitHub: [https://github.com/marceldavidbaroi/MindVault_Frontend](https://github.com/marceldavidbaroi/MindVault_Frontend)

---

## Project Overview

MindVault Frontend provides a **modular, role-aware, and interactive UI** for the MindVault platform.

Key Features:

- **Authentication & User Management** – Signup, login, profile management, and session handling.
- **Finance Management** – View accounts, transactions, summaries, and reports.
- **Modular UI Components** – Built with **ShadCN** components and **Lucide icons**.
- **State Management** – Client-side state managed via **Zustand**.
- **Notifications** – Global API response notifications using **Sonner**.
- **Reactivity & Animations** – Smooth animations with **Framer Motion**.
- **Charts & Graphs** – Visualize finance data using **Recharts** and **Chart.js**.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS, Tailwind Variants
- **UI Components:** ShadCN, Radix UI, Lucide icons
- **Charts & Data Visualization:** Chart.js, React Chart.js 2, Recharts, Ant Design Plots
- **State Management:** Zustand
- **Forms & Validation:** React Hook Form, Zod
- **Notifications:** Sonner
- **Animations:** Framer Motion
- **Date Handling:** date-fns

---

## Environment Variables

Create a `.env.local` file in the root with the following:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

This points to the backend API.

---

## Run Instructions

1. **Install dependencies**:

```bash
npm install
```

2. **Run the development server** (default port `3001`):

```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Build & Production

1. **Build for production**:

```bash
npm run build
```

2. **Start the production server**:

```bash
npm run start
```

> By default, Next.js handles static optimization, SSR, and incremental builds.

---

## Folder Structure & Naming

- **`app/`** → Pages and layouts, follows Next.js App Router structure
- **`components/`** → Domain-specific and shared UI components
- **`lib/`** → API fetcher and framework-level helpers
- **`utils/`** → Pure utility functions (global vs module-specific)
- **`store/`** → Zustand stores for state management
- **`composables/`** → Reusable hooks

For detailed conventions and naming, see the [Frontend Developer Guide](./DeveloperGuide.md).

---

## Global Features

- **Initial Data Provider**: Pre-fetches global user and app data at startup to prevent UI errors.
- **API Response Toast**: Displays global success/error notifications for API calls using **Sonner**. Configurable in `components/ApiResponseToast.tsx`.

---

## Links

- Backend Repository: [MindVault Backend](https://github.com/marceldavidbaroi/MindVault_Backend)
- API Docs (local): [http://localhost:3000/api/v1/docs#/](http://localhost:3000/api/v1/docs#/)

---

✅ **MindVault Frontend** is designed to be modular, scalable, and user-friendly, providing a solid interface for financial and productivity operations while integrating seamlessly with the backend.

---
