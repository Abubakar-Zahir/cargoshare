import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { BenchShell, Section } from "./bento/_components/bench-shell";

export const metadata: Metadata = {
  title: "Review: all pages",
  robots: { index: false, follow: false },
};

const groups = [
  {
    id: "public",
    title: "Public pages",
    description: "What anyone sees before signing in.",
    pages: [
      {
        href: "/",
        title: "Landing",
        note: "Hero, how it works, price example, cities, trust, both paths.",
      },
      {
        href: "/no-such-page",
        title: "Page not found",
        note: "The 404 people land on from a broken link.",
      },
    ],
  },
  {
    id: "app",
    title: "App shell",
    description:
      "Sidebar on desktop, rail on tablets, top bar and bottom nav on phones.",
    pages: [
      {
        href: "/dev/shell",
        title: "Carries and sends",
        note: "Full menu, Post in the bottom nav, 3 requests waiting.",
      },
      {
        href: "/dev/shell?role=send",
        title: "Sends only",
        note: "Shorter menu; the bottom nav slot becomes Send.",
      },
      {
        href: "/dev/shell?requests=0",
        title: "No requests waiting",
        note: "No count badges anywhere.",
      },
    ],
  },
  {
    id: "design",
    title: "Design bench",
    description: "Every component with realistic content.",
    pages: [
      {
        href: "/dev/bento",
        title: "Dashboard",
        note: "Returning user and new user.",
      },
      {
        href: "/dev/bento/tickets",
        title: "Tickets",
        note: "Trip passes, stamps, routes and numbers.",
      },
      {
        href: "/dev/bento/lists",
        title: "Lists",
        note: "Requests with Accept and Decline, shipments.",
      },
      {
        href: "/dev/bento/forms-and-buttons",
        title: "Forms and buttons",
        note: "Inputs, selects, buttons, dialogs and sheets.",
      },
      {
        href: "/dev/bento/states",
        title: "States",
        note: "Empty, error, loading, step tracker, status line.",
      },
    ],
  },
] as const;

export default async function ReviewHubPage() {
  const host = (await headers()).get("host") ?? "localhost:3000";
  const [hostname = "", port = "3000"] = host.split(":");
  const onThisComputer = ["localhost", "127.0.0.1", "[::1]"].includes(hostname);

  return (
    <BenchShell current="/dev" title="Everything to review">
      <div className="flex max-w-[60ch] flex-col gap-3 text-lg text-ink-muted">
        <p>
          Every page in one place. Change the theme above, or with the moon and
          sun button at the top of each page.
        </p>
        <p>
          {onThisComputer ? (
            <>
              To check on a phone on the same Wi-Fi, open this page there with
              this computer&apos;s network address instead of localhost, for
              example{" "}
              <span className="font-mono text-base break-all text-ink">
                http://192.168.1.20{port === "" ? "" : `:${port}`}/dev
              </span>
              .
            </>
          ) : (
            <>
              You&apos;re on the network address{" "}
              <span className="font-mono text-base break-all text-ink">
                http://{host}/dev
              </span>
              . Open the same address on any phone on this Wi-Fi.
            </>
          )}
        </p>
      </div>
      {groups.map((group) => (
        <Section
          key={group.id}
          id={group.id}
          title={group.title}
          description={group.description}
        >
          <ul className="grid border-t border-line md:grid-cols-2 md:gap-x-10 xl:grid-cols-3">
            {group.pages.map((page) => (
              <li key={page.href} className="border-b border-line">
                <Link
                  href={page.href}
                  className="group flex min-h-16 flex-col justify-center gap-0.5 py-4 active:bg-surface-2"
                >
                  <span className="text-lg font-medium underline-offset-4 group-hover:underline">
                    {page.title}
                  </span>
                  <span className="text-base text-ink-muted">{page.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </BenchShell>
  );
}
