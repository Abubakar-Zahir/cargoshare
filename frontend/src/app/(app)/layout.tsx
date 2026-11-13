import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AppShell from "@/components/shell/app-shell";
import { getMyProfile } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { LOGIN_PATH } from "@/lib/constants";

const AppLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const token = await getAccessToken();
  if (!token) redirect(LOGIN_PATH);
  const profile = await getMyProfile(token);
  if (!profile) redirect(LOGIN_PATH);
  return <AppShell profile={profile}>{children}</AppShell>;
};
export default AppLayout;
