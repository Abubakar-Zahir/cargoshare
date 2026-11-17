import BottomNav from "@/components/shell/bottom-nav";
import Sidebar from "@/components/shell/sidebar";
import SkipLink from "@/components/shell/skip-link";
import UserMenu from "@/components/shell/user-menu";
import type { AppShellProps } from "@/lib/types";

const AppShell = ({ profile, children }: AppShellProps) => (
  <div className="mx-auto flex w-full max-w-[1440px] flex-1">
    <SkipLink />
    <Sidebar isTraveler={profile.is_traveler} />
    <div className="min-w-0 flex-1 px-4 pt-5 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-8 md:pb-12 xl:px-12">
      <div className="mb-8 flex min-w-0 items-center justify-between gap-3 border-b border-line pb-5">
        <p className="text-sm text-ink-muted">Your CargoShare</p>
        <UserMenu profile={profile} />
      </div>
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl">
        {children}
      </main>
    </div>
    <BottomNav isTraveler={profile.is_traveler} />
  </div>
);
export default AppShell;
