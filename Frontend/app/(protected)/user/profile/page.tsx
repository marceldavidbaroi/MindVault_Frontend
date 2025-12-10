import UserIndex from "@/components/user/UserIndex";
import { API_ENDPOINTS } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { ApiResponse } from "@/types/ApiResponse.type";
import { cookies } from "next/headers";
import React from "react";

const ProfilePage = async () => {
  const cookieStore = await cookies();

  // ✅ Construct cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const profile: ApiResponse<any> = await fetcher(API_ENDPOINTS.user.profile, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  return (
    <>
      <UserIndex user={profile.data} />
    </>
  );
};

export default ProfilePage;
