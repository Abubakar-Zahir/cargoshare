import {
  HomeIcon,
  InboxIcon,
  type LucideIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  TicketIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: "requests";
}

export interface NavUser {
  canCarry: boolean;
}

const home: NavItem = {
  id: "home",
  href: "/dashboard",
  label: "Home",
  icon: HomeIcon,
};
const search: NavItem = {
  id: "search",
  href: "/search",
  label: "Search",
  icon: SearchIcon,
};
const requests: NavItem = {
  id: "requests",
  href: "/requests",
  label: "Requests",
  icon: InboxIcon,
  badge: "requests",
};
const trips: NavItem = {
  id: "trips",
  href: "/trips",
  label: "My trips",
  icon: TicketIcon,
};
const shipments: NavItem = {
  id: "shipments",
  href: "/shipments",
  label: "Shipments",
  icon: PackageIcon,
};
const wallet: NavItem = {
  id: "wallet",
  href: "/wallet",
  label: "Wallet",
  icon: WalletIcon,
};
const profile: NavItem = {
  id: "profile",
  href: "/profile",
  label: "Profile",
  icon: UserIcon,
};

export function sidebarItems(user: NavUser): NavItem[] {
  return user.canCarry
    ? [home, search, requests, trips, shipments, wallet, profile]
    : [home, search, shipments, wallet, profile];
}

export function createItem(user: NavUser): NavItem {
  return user.canCarry
    ? { id: "post", href: "/trips/new", label: "Post", icon: PlusIcon }
    : { id: "send", href: "/search", label: "Send", icon: SendIcon };
}

export function bottomNavItems(user: NavUser): NavItem[] {
  return [
    { ...home, badge: user.canCarry ? "requests" : undefined },
    search,
    createItem(user),
    shipments,
    profile,
  ];
}

export function isActive(
  item: NavItem,
  pathname: string,
  items: NavItem[],
): boolean {
  const owner = items
    .filter(
      (candidate) =>
        pathname === candidate.href ||
        pathname.startsWith(`${candidate.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  return owner?.id === item.id;
}
