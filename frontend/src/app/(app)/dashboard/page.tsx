import type { Metadata } from "next";
import { redirect } from "next/navigation";
import GetStarted from "@/components/domain/get-started";
import EmptyState from "@/components/feedback/empty-state";
import { getMyProfile } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { LOGIN_PATH } from "@/lib/constants";

export const metadata: Metadata = { title: "Dashboard | CargoShare" };

const DashboardPage = async () => {
  const token = await getAccessToken();
  if (!token) redirect(LOGIN_PATH);
  const profile = await getMyProfile(token);
  if (!profile) redirect(LOGIN_PATH);
  const now = new Date();
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Karachi",
    }).format(now),
  );
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <>
      <div className="mb-8">
        <h1 className="break-words">
          {greeting}, {profile.display_name ?? profile.username}
        </h1>
        <p className="mt-3 text-ink-muted">
          {new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            timeZone: "Asia/Karachi",
          }).format(now)}
        </p>
      </div>
      <GetStarted profile={profile} />
      <section
        aria-labelledby="your-turn-title"
        className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
      >
        <h2 id="your-turn-title" className="font-display text-2xl font-semibold">
          Your turn
        </h2>
        <EmptyState title="Nothing needs you right now">
          <p>
            Requests, payments and delivery tasks will appear here as those features become
            available.
          </p>
          <a
            href="#get-started-title"
            className="mt-5 inline-flex min-h-12 items-center font-medium"
          >
            Review your next steps
          </a>
        </EmptyState>
      </section>
    </>
  );
};
export default DashboardPage;
