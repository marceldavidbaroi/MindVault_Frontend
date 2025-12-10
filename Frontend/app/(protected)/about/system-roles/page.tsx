import React, { JSX } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, UserCog, Eye, UserPen } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/ApiResponse.type";
import { cookies } from "next/headers";

const iconMap: Record<string, JSX.Element> = {
  owner: <Shield className="h-6 w-6 text-primary" />,
  admin: <UserCog className="h-6 w-6 text-primary" />,
  editor: <UserPen className="h-6 w-6 text-primary" />,
  viewer: <Eye className="h-6 w-6 text-primary" />,
};

const AboutPage = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const roles: ApiResponse<any> = await fetcher(API_ENDPOINTS.roles.getAll, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const roleList = roles?.data ?? [];

  return (
    <div className="max-w-[1024px] mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground drop-shadow">
          System Role Configurations
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleList.map((role: any) => (
          <Card
            key={role.id}
            className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-card-foreground">
                {iconMap[role.name] || (
                  <Shield className="h-6 w-6 text-primary" />
                )}
                <span>{role.displayName}</span>
              </CardTitle>
              <span className="text-xs text-muted-foreground uppercase">
                #{role.id}
              </span>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1 text-foreground/80">
                {role.description
                  ? role.description
                      .split(".")
                      .filter((line: string) => line.trim().length > 0)
                      .map((line: string, idx: number) => (
                        <li key={idx}>{line.trim()}.</li>
                      ))
                  : [<li key="no-desc">No description provided.</li>]}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
