export const DASHBOARD_PATH = "/dashboard";

export type NavItem = Readonly<{ label: string; href: string; available: boolean }>;

// Only Home has shipped; future destinations have no clickable links yet.
export const getNavItems = (isTraveler: boolean, mobile = false): readonly NavItem[] => {
  const home = { label: "Home", href: DASHBOARD_PATH, available: true };
  const search = { label: "Search", href: "/search", available: false };
  const shipments = { label: "Shipments", href: "/shipments", available: false };
  const profile = { label: "Profile", href: "/profile", available: false };
  if (mobile)
    return [
      home,
      search,
      {
        label: isTraveler ? "Post" : "Send",
        href: isTraveler ? "/trips/new" : "/search",
        available: false,
      },
      shipments,
      profile,
    ];
  return [
    home,
    search,
    ...(isTraveler
      ? [
          { label: "Requests", href: "/requests", available: false },
          { label: "My trips", href: "/trips", available: false },
        ]
      : []),
    shipments,
    { label: "Wallet", href: "/wallet", available: false },
    profile,
  ];
};
