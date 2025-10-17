// components/navigation/navConfig.ts

export interface NavItem {
  title: string;
  href?: string;
  description?: string;
  subItems?: NavItem[];
}

export const navConfig: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Overview of all your activities and quick insights.",
  },
  {
    title: "Finance",
    description: "Manage transactions, savings goals, and reports.",
    subItems: [
      {
        title: "Transactions",
        href: "/finance/transaction",
        description: "View and track your daily financial transactions.",
      },
      {
        title: "Savings Goal",
        href: "/finance/savings-goal",
        description:
          "Set and monitor your personal or business savings targets.",
      },
      {
        title: "Reports",
        href: "/finance/reports",
        description: "Analyze spending trends with detailed visual reports.",
      },
    ],
  },
  {
    title: "Vault",
    description: "Securely store documents and credentials.",
    subItems: [
      {
        title: "Documents",
        href: "/vault/documents",
        description: "Upload and manage important files safely.",
      },
      {
        title: "Passwords",
        href: "/vault/passwords",
        description: "Keep all your passwords encrypted in one place.",
      },
    ],
  },
  {
    title: "Me",
    description: "Personal account and preferences.",
    subItems: [
      {
        title: "Profile",
        href: "/me/profile",
        description: "View and edit your profile information.",
      },
      {
        title: "Settings",
        href: "/me/settings",
        description: "Customize your experience and manage preferences.",
      },
      {
        title: "Logout",
        href: "/auth/logout",
        description: "Sign out of your MindVault account.",
      },
    ],
  },
];
