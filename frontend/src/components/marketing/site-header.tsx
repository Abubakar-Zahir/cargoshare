import Link from "next/link";
import ThemeToggle from "@/components/theme/theme-toggle";
import { getMyProfile } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import {
  APP_NAME,
  DARK_MODE_LABEL,
  DARK_THEME,
  HOME_PATH,
  LIGHT_MODE_LABEL,
  LIGHT_THEME,
  LOGIN_PATH,
} from "@/lib/constants";

const SiteHeader = async () => {
  const token = await getAccessToken();
  const profile = token ? await getMyProfile(token) : null;
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold text-ink no-underline">
          {APP_NAME}
        </Link>
        <nav aria-label="Site navigation" className="flex items-center gap-3 sm:gap-6">
          <Link
            href={profile ? HOME_PATH : LOGIN_PATH}
            className="inline-flex min-h-12 items-center text-sm font-medium"
          >
            {profile ? "Dashboard" : "Log in"}
          </Link>
          <ThemeToggle
            lightLabel={LIGHT_MODE_LABEL}
            darkLabel={DARK_MODE_LABEL}
            lightTheme={LIGHT_THEME}
            darkTheme={DARK_THEME}
          />
        </nav>
      </div>
    </header>
  );
};
export default SiteHeader;
