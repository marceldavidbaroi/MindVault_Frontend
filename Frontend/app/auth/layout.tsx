// components/AuthLayout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title = "Welcome",
  subtitle = "Sign in to continue",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Top text */}
      {/* <header className="py-12 text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </header> */}

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 ">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">MindVault</span>
      </footer>
    </div>
  );
}
