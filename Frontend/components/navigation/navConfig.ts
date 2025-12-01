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
    description: "Manage transactions, savings goals, accounts, and reports.",
    subItems: [
      {
        title: "Accounts",
        href: "/finance/accounts",
        description: "View, create, and manage all accounts.",
      },
      {
        title: "Account Types",
        href: "/finance/account-types",
        description: "Manage different types of accounts in the system.",
      },
      {
        title: "Category",
        href: "/finance/category",
        description: "All your transaction categories in one place.",
      },
      {
        title: "Currency",
        href: "/finance/currency",
        description:
          "Manage and track different currency conversions and rates.",
      },
      {
        title: "Reports",
        href: "/finance/reports",
        description: "Analyze spending trends with detailed visual reports.",
      },
      {
        title: "Savings Goal",
        href: "/finance/savings-goals",
        description:
          "Set and monitor your personal or business savings targets.",
      },
      {
        title: "Transaction Explorer",
        href: "/finance/transaction-explorer",
        description:
          "Search, filter, and view detailed transactions by date, type, and category.",
      },
      {
        title: "Transactions",
        href: "/finance/transaction",
        description: "View and track your daily financial transactions.",
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
        title: "Logout",
        href: "/auth/logout",
        description: "Sign out of your MindVault account.",
      },
      {
        title: "Profile",
        href: "/user/profile",
        description: "View and edit your profile information.",
      },
      {
        title: "Settings",
        href: "/user/settings",
        description: "Customize your experience and manage preferences.",
      },
      {
        title: "System Role Configs",
        href: "/user/system-role-configs",
        description:
          "See what each system role can do — permissions and access levels across the app.",
      },
    ],
  },
  {
    title: "About",
    description: "Learn more about this app and its vision.",
    subItems: [
      {
        title: "App Overview",
        href: "/about/app-overview",
        description:
          "Discover what MindVault is all about — your all-in-one productivity and finance companion.",
      },
      {
        title: "System Roles",
        href: "/about/system-roles",
        description: "All the system declared roles.",
      },
    ],
  },
];
