"use client";

import { cn } from "cn";
import Link from "next/link";

import { CountBadge } from "@/components/ui/badge";

import type { NavItem } from "./nav-items";

export function NavLink({
  item,
  active,
  count,
  layout,
}: {
  item: NavItem;
  active: boolean;
  count: number;
  layout: "row" | "stack" | "tab";
}) {
  const Icon = item.icon;
  const showBadge = item.badge !== undefined && count > 0;
  return (
    <Link
      prefetch={false}
      href={item.href}
      aria-current={active ? "page" : undefined}
      aria-label={
        showBadge
          ? `${item.label}, ${String(count)} requests waiting`
          : undefined
      }
      className={cn(
        "relative flex rounded-control text-ink-muted transition-colors duration-150 hover:bg-surface-2 hover:text-ink aria-[current=page]:text-ink",
        layout === "row" &&
          "min-h-11 items-center gap-3 px-3 text-base aria-[current=page]:bg-surface-2 aria-[current=page]:font-medium",
        layout === "stack" &&
          "min-h-16 flex-col items-center justify-center gap-1 px-1 text-sm aria-[current=page]:bg-surface-2 aria-[current=page]:font-medium",
        layout === "tab" &&
          "min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-sm hover:bg-transparent active:bg-surface-2 aria-[current=page]:font-semibold pointer-coarse:min-h-16",
      )}
    >
      <span className="relative">
        <Icon
          aria-hidden
          className={cn("size-5", active && layout === "tab" && "text-accent")}
          strokeWidth={active ? 2.25 : 1.75}
        />
        {showBadge && layout !== "row" && (
          <span aria-hidden>
            <CountBadge
              count={count}
              className="absolute -top-2 -right-3.5 h-5 min-w-5 px-1 text-xs"
            />
          </span>
        )}
      </span>
      <span className="max-w-full truncate">{item.label}</span>
      {showBadge && layout === "row" && (
        <span aria-hidden className="ml-auto">
          <CountBadge count={count} />
        </span>
      )}
    </Link>
  );
}
