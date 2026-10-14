import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BentoColumn, BentoGrid } from "@/components/bento/bento-grid";
import { BentoTile } from "@/components/bento/bento-tile";
import { TicketPass } from "@/components/domain/ticket-pass";
import { RequestsLink, YourTurn } from "@/components/domain/your-turn";
import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";

import { nextTrip, turnItems } from "../bento/_components/demo-data";

export const metadata: Metadata = {
  title: "Bench: app shell",
  robots: { index: false, follow: false },
};

// eslint-disable-next-line @typescript-eslint/require-await -- Next.js requires Server Actions to be async even when they do not await.
async function signOut() {
  "use server";
  redirect("/dev/shell");
}

export default async function ShellBenchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const canCarry = params.role !== "send";
  const requestsCount = canCarry ? Number(params.requests ?? "3") || 0 : 0;

  return (
    <AppShell
      user={{ displayName: "Sana Malik", username: "sana" }}
      navUser={{ canCarry }}
      requestsCount={requestsCount}
      signOutAction={signOut}
    >
      <div className="flex flex-col gap-8">
        <nav
          aria-label="Shell variants"
          className="flex flex-wrap gap-x-5 text-base"
        >
          <Link
            href="/dev"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            All pages
          </Link>
          <Link
            href="/dev/shell"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            Carries and sends
          </Link>
          <Link
            href="/dev/shell?role=send"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            Sends only
          </Link>
          <Link
            href="/dev/shell?requests=0"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            No requests waiting
          </Link>
        </nav>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-h1">Good evening, Sana</h1>
          <p className="text-base text-ink-muted">Tuesday, 13 October</p>
        </div>
        <BentoGrid>
          <BentoTile
            span={{ base: 2, md: 6, lg: 6 }}
            title="Your turn"
            footer={
              canCarry && requestsCount > 0 ? (
                <RequestsLink count={requestsCount} href="/requests" />
              ) : undefined
            }
          >
            <YourTurn
              items={canCarry ? turnItems : turnItems.slice(0, 1)}
              emptyAction={
                <Button variant="secondary" size="sm" className="w-fit">
                  Find a trip
                </Button>
              }
            />
          </BentoTile>
          {canCarry && (
            <BentoColumn span={{ base: 2, md: 6, lg: 6 }}>
              <h2 className="sr-only">Next trip</h2>
              <TicketPass {...nextTrip} href="/trips" />
            </BentoColumn>
          )}
        </BentoGrid>
      </div>
    </AppShell>
  );
}
