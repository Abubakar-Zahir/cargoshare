import type { TravelerNavProps } from "@/lib/types";
import { cookies } from "next/headers";

import { getNavItems } from "@/components/shell/nav-items";
import NavLink from "@/components/shell/nav-link";
import Button from "@/components/ui/button";

const NAV_COOKIE = "nav";

const saveNavigation = async (formData: FormData): Promise<void> => {
  "use server";
  const width = formData.get(NAV_COOKIE);
  if (width !== "compact" && width !== "expanded") return;
  const store = await cookies();
  store.set(NAV_COOKIE, width, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 31_536_000,
  });
};

const Sidebar = async ({ isTraveler }: TravelerNavProps) => {
  const store = await cookies();
  const saved = store.get(NAV_COOKIE)?.value;
  const width = saved === "compact" || saved === "expanded" ? saved : null;
  const widthClasses =
    width === "compact" ? "w-28" : width === "expanded" ? "w-60" : "w-28 xl:w-60";
  return (
    <aside className={`hidden shrink-0 border-r border-line px-3 py-6 md:block ${widthClasses}`}>
      <nav aria-label="Main navigation" className="sticky top-6 flex flex-col gap-2">
        <p className="mb-3 px-2 text-xs font-medium tracking-widest text-ink-muted uppercase">
          Your space
        </p>
        {getNavItems(isTraveler).map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        <p className="mt-4 px-2 text-xs text-ink-muted">More features coming soon.</p>
        <form action={saveNavigation} className="mt-4">
          {width !== "expanded" && (
            <Button
              type="submit"
              variant="secondary"
              name={NAV_COOKIE}
              value="expanded"
              className={`w-full px-1 text-xs ${width === null ? "xl:hidden" : ""}`}
            >
              Expand
            </Button>
          )}
          {width !== "compact" && (
            <Button
              type="submit"
              variant="secondary"
              name={NAV_COOKIE}
              value="compact"
              className={`w-full px-1 text-xs ${width === null ? "hidden xl:inline-flex" : ""}`}
            >
              Collapse
            </Button>
          )}
        </form>
      </nav>
    </aside>
  );
};
export default Sidebar;
