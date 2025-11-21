"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRoleStore } from "@/store/rolesStore";

export default function SignInPage() {
  const authStore = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState("David");
  const [password, setPassword] = useState("David@123");
  const [showPassword, setShowPassword] = useState(false);
  const userStore = useUserStore();
  const roleStore = useRoleStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authStore.signin(username, password);
      await userStore.getProfile();
      await roleStore.getAllRoles();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to continue</CardDescription>
      </CardHeader>

      {/* ✅ Entire content inside one form */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Username */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center space-x-0">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="rounded-r-none"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPassword(!showPassword)}
                className="rounded-l-none px-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>

            <button
              type="button"
              className="text-sm text-right text-primary underline mt-1 self-end"
              onClick={() => router.push("/auth/forgot")}
            >
              Forgot Password?
            </button>
          </div>
        </CardContent>

        {/* ✅ The submit button must be INSIDE the form */}
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/sign-up")}
              className="text-primary underline"
            >
              Sign Up
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
