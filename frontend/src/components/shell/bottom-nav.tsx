"use client";

import { usePathname } from "next/navigation";

import { bottomNavItems, isActive, type NavUser } from "./nav-items";
import { NavLink } from "./nav-link";

export function BottomNav({
  navUser,
  requestsCount,
}: {
  navUser: NavUser;
  requestsCount: number;
}) {
  const pathname = usePathname();
  const items = bottomNavItems(navUser);

  return (
    <nav
      aria-label="Main"
      data-slot="bottom-nav"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => (
          <li key={item.id}>
            <NavLink
              item={item}
              active={isActive(item, pathname, items)}
              count={requestsCount}
              layout="tab"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
