"use client";

import { cn } from "cn";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/use-theme";
import { applyTheme, parseTheme, type Theme } from "@/lib/theme";

export interface ShellUser {
  displayName: string;
  username: string;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({
  user,
  theme: initialTheme,
  signOutAction,
  showName = false,
  className,
}: {
  user: ShellUser;
  theme: Theme;
  signOutAction: () => Promise<void>;
  showName?: boolean;
  className?: string;
}) {
  const theme = useTheme(initialTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={
          showName ? undefined : `Account menu for ${user.displayName}`
        }
        className={cn(
          "flex min-h-11 min-w-11 cursor-pointer items-center gap-3 rounded-control text-left hover:bg-surface-2",
          showName && "w-full px-2 py-1.5",
          className,
        )}
      >
        <Avatar className="size-9">
          <AvatarFallback>{initials(user.displayName)}</AvatarFallback>
        </Avatar>
        {showName && (
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{user.displayName}</span>
            <span className="truncate text-sm text-ink-muted">
              @{user.username}
            </span>
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Signed in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link prefetch={false} href="/profile">
            Your profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link prefetch={false} href="/settings">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => {
            applyTheme(parseTheme(value));
          }}
        >
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            Same as device
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
