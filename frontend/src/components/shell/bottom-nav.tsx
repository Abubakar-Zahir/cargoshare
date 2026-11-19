import type { TravelerNavProps } from "@/lib/types";
import { getNavItems } from "@/components/shell/nav-items";
import NavLink from "@/components/shell/nav-link";

const BottomNav = ({ isTraveler }: TravelerNavProps) => (
  <nav
    aria-label="Mobile navigation"
    className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-line bg-surface px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
  >
    {getNavItems(isTraveler, true).map((item) => (
      <NavLink key={item.label} item={item} compact />
    ))}
  </nav>
);
export default BottomNav;
