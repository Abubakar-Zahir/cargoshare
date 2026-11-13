"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/components/shell/nav-items";

const NavLink = ({ item, compact = false }: Readonly<{ item: NavItem; compact?: boolean }>) => {
  const pathname = usePathname();
  const classes = `flex min-h-12 min-w-0 items-center rounded-control py-2 no-underline ${compact ? "justify-center px-1 text-center text-xs" : "gap-3 px-2 text-sm"}`;
  if (!item.available)
    return (
      <span
        aria-disabled="true"
        title={`${item.label} — coming soon`}
        className={`${classes} text-ink-muted`}
      >
        <span className={compact ? undefined : "truncate"}>{item.label}</span>
        {!compact && <span className="ml-auto text-xs md:hidden xl:inline">Soon</span>}
      </span>
    );
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`${classes} ${active ? "bg-accent-soft font-semibold text-accent" : "text-ink"}`}
    >
      <span className={compact ? undefined : "truncate"}>{item.label}</span>
    </Link>
  );
};
export default NavLink;
