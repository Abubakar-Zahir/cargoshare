import type { ChildrenProps } from "@/lib/types";
import AppShell from "@/components/shell/app-shell";
import { requireProfile } from "@/lib/auth/require-profile";

const AppLayout = async ({ children }: ChildrenProps) => {
  const profile = await requireProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
};
export default AppLayout;
