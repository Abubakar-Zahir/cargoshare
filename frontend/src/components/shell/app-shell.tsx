import { cookies } from "next/headers";
import type * as React from "react";

import { AppProviders } from "@/components/providers/app-providers";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";

import { BottomNav } from "./bottom-nav";
import type { NavUser } from "./nav-items";
import { NAV_COOKIE, parseNavMode } from "./nav-state";
import { Sidebar } from "./sidebar";
import { SkipLink } from "./skip-link";
import { UserMenu, type ShellUser } from "./user-menu";
import { Wordmark } from "./wordmark";

export async function AppShell({
  user,
  navUser,
  requestsCount,
  signOutAction,
  children,
}: {
  user: ShellUser;
  navUser: NavUser;
  requestsCount: number;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const store = await cookies();
  const theme = parseTheme(store.get(THEME_COOKIE)?.value);
  const navMode = parseNavMode(store.get(NAV_COOKIE)?.value);

  return (
    <div data-slot="app-shell" className="flex min-h-dvh">
      <SkipLink />
      <Sidebar
        user={user}
        navUser={navUser}
        requestsCount={requestsCount}
        theme={theme}
        initialMode={navMode}
        signOutAction={signOutAction}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg px-4 sm:px-5 md:hidden">
          <Wordmark href="/dashboard" />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu user={user} theme={theme} signOutAction={signOutAction} />
          </div>
        </header>
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 px-4 pt-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] outline-none sm:px-5 md:px-6 md:pb-10 lg:px-8 xl:px-10"
        >
          <AppProviders>{children}</AppProviders>
        </main>
      </div>
      <BottomNav navUser={navUser} requestsCount={requestsCount} />
    </div>
  );
}
