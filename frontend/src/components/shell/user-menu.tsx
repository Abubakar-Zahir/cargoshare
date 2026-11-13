import { cookies } from "next/headers";

import Button from "@/components/ui/button";
import { logOut } from "@/lib/auth/actions";
import { LOG_OUT_LABEL, THEME_COOKIE } from "@/lib/constants";
import type { Profile } from "@/lib/types";

const useDeviceTheme = async (): Promise<void> => {
  "use server";
  const store = await cookies();
  store.delete(THEME_COOKIE);
};

const UserMenu = ({ profile }: Readonly<{ profile: Profile }>) => (
  <details className="relative max-w-64 min-w-0">
    <summary className="flex min-h-12 cursor-pointer items-center gap-2 rounded-control border border-line-strong px-3 text-sm">
      <span className="truncate" title={profile.username}>
        @{profile.username}
      </span>
      <span aria-hidden="true">▾</span>
    </summary>
    <div className="absolute right-0 z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-control border border-line bg-surface p-4 shadow-lg">
      <p className="truncate font-medium" title={profile.display_name ?? profile.username}>
        {profile.display_name ?? profile.username}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        {profile.is_verified ? "ID verified" : "ID not verified"}
      </p>
      <form action={useDeviceTheme} className="mt-4">
        <Button type="submit" variant="secondary" className="w-full">
          Same as device
        </Button>
      </form>
      <form action={logOut} className="mt-3">
        <Button type="submit" variant="secondary" className="w-full">
          {LOG_OUT_LABEL}
        </Button>
      </form>
    </div>
  </details>
);
export default UserMenu;
