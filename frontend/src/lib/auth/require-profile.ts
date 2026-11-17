import { redirect } from "next/navigation";
import { cache } from "react";

import { getMyProfile } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { LOGIN_PATH } from "@/lib/constants";
import type { Profile } from "@/lib/types";

// Shared by protected layouts/pages; memoized only within the server render.
export const requireProfile = cache(async (): Promise<Profile> => {
  const token = await getAccessToken();
  if (!token) redirect(LOGIN_PATH);

  const profile = await getMyProfile(token);
  if (!profile) redirect(LOGIN_PATH);

  return profile;
});
