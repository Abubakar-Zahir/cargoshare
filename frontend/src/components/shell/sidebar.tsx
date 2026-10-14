"use client";

import { cn } from "cn";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { Theme } from "@/lib/theme";

import { isActive, sidebarItems, type NavUser } from "./nav-items";
import { NavLink } from "./nav-link";
import { saveNavMode, type NavMode } from "./nav-state";
import { UserMenu, type ShellUser } from "./user-menu";
import { Wordmark } from "./wordmark";

export function Sidebar({
  user,
  navUser,
  requestsCount,
  theme,
  initialMode,
  signOutAction,
}: {
  user: ShellUser;
  navUser: NavUser;
  requestsCount: number;
  theme: Theme;
  initialMode: NavMode;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [mode, setMode] = useState<NavMode>(initialMode);
  const items = sidebarItems(navUser);
  const full = mode === "full";

  return (
    <aside
      data-slot="sidebar"
      data-mode={mode}
      className={cn(
        "group/nav sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface md:flex",
        full ? "w-[88px] lg:w-64" : "w-[88px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center px-4",
          full && "lg:justify-between lg:pr-2 lg:pl-5",
        )}
      >
        <Wordmark
          href="/dashboard"
          className={cn("hidden", full && "lg:block")}
        />
        <Wordmark
          href="/dashboard"
          compact
          className={cn("mx-auto", full && "lg:hidden")}
        />
        {full && <ThemeToggle className="hidden lg:inline-flex" />}
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-2">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <span className={cn(full && "lg:hidden")}>
                <NavLink
                  item={item}
                  active={isActive(item, pathname, items)}
                  count={requestsCount}
                  layout="stack"
                />
              </span>
              {full && (
                <span className="hidden lg:block">
                  <NavLink
                    item={item}
                    active={isActive(item, pathname, items)}
                    count={requestsCount}
                    layout="row"
                  />
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-1 border-t border-line p-2">
        <ThemeToggle className={cn("mx-auto", full && "lg:hidden")} />
        <UserMenu
          user={user}
          theme={theme}
          signOutAction={signOutAction}
          className={cn("mx-auto", full && "lg:hidden")}
        />
        {full && (
          <UserMenu
            user={user}
            theme={theme}
            signOutAction={signOutAction}
            showName
            className="hidden lg:flex"
          />
        )}
        <button
          type="button"
          onClick={() => {
            const next = full ? "rail" : "full";
            setMode(next);
            saveNavMode(next);
          }}
          className="hidden min-h-11 cursor-pointer items-center justify-center gap-2 rounded-control px-3 text-sm text-ink-muted hover:bg-surface-2 hover:text-ink lg:flex"
        >
          {full ? (
            <PanelLeftCloseIcon aria-hidden className="size-4" />
          ) : (
            <PanelLeftOpenIcon aria-hidden className="size-4" />
          )}
          <span className={cn(!full && "sr-only")}>
            {full ? "Collapse menu" : "Expand menu"}
          </span>
        </button>
      </div>
    </aside>
  );
}
