import type { Metadata } from "next";

import { BentoColumn, BentoGrid } from "@/components/bento/bento-grid";
import { BentoTile } from "@/components/bento/bento-tile";
import { AtAGlance } from "@/components/domain/at-a-glance";
import { GetStarted } from "@/components/domain/get-started";
import { PriceTag } from "@/components/domain/price-tag";
import { RatingStars } from "@/components/domain/rating-stars";
import { TicketPass } from "@/components/domain/ticket-pass";
import { RequestsLink, YourTurn } from "@/components/domain/your-turn";
import { Button } from "@/components/ui/button";

import { BenchShell, Section } from "./_components/bench-shell";
import { nextTrip, turnItems } from "./_components/demo-data";

export const metadata: Metadata = {
  title: "Bench: dashboard",
  robots: { index: false, follow: false },
};

function Greeting({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-display text-h1">Good evening, {name}</p>
      <p className="text-base text-ink-muted">{date}</p>
    </div>
  );
}

export default function DashboardBenchPage() {
  return (
    <BenchShell current="/dev/bento" title="Dashboard">
      <Section
        id="returning"
        title="Returning user"
        description="Greeting, at most three things that need you, the next trip, and three numbers. Nothing else."
      >
        <Greeting name="Sana" date="Tuesday, 13 October" />
        <BentoGrid animateEntrance>
          <BentoTile
            span={{ base: 2, md: 6, lg: 6 }}
            title="Your turn"
            footer={<RequestsLink count={3} href="/requests" />}
          >
            <YourTurn
              items={turnItems}
              emptyAction={
                <Button variant="secondary" size="sm" className="w-fit">
                  Find a trip
                </Button>
              }
            />
          </BentoTile>
          <BentoColumn span={{ base: 2, md: 6, lg: 6 }}>
            <h2 className="sr-only">Next trip</h2>
            <TicketPass {...nextTrip} href="/trips" />
          </BentoColumn>
          <AtAGlance
            className="col-span-2 md:col-span-6 lg:col-span-12"
            stats={[
              {
                id: "rating",
                label: "Rating",
                value: <RatingStars value={4.8} count={23} />,
              },
              {
                id: "month",
                label: "Received this month",
                value: <PriceTag amount={18400} />,
                href: "/wallet",
              },
              {
                id: "delivered",
                label: "Delivered",
                value: (
                  <span>
                    <span className="font-mono font-semibold tabular-nums">
                      12
                    </span>{" "}
                    shipments
                  </span>
                ),
              },
            ]}
          />
        </BentoGrid>
      </Section>

      <Section
        id="new-user"
        title="New user"
        description="The checklist disappears once every step is done. With nothing to do, Your turn says so and offers one next step."
      >
        <Greeting name="Hira" date="Tuesday, 13 October" />
        <BentoGrid>
          <GetStarted
            className="col-span-2 md:col-span-6 lg:col-span-12"
            steps={[
              {
                id: "roles",
                title: "Choose what you'll do",
                description: "Send things, carry things, or both.",
                done: true,
                action: null,
              },
              {
                id: "verify",
                title: "Verify your ID",
                description:
                  "Takes two minutes. An admin checks it within a day.",
                done: false,
                action: <Button size="sm">Upload your ID</Button>,
              },
              {
                id: "first",
                title: "Post a trip or send something",
                description: "Start with whichever you need today.",
                done: false,
                action: (
                  <Button variant="secondary" size="sm">
                    Send something
                  </Button>
                ),
              },
            ]}
          />
          <BentoTile span={{ base: 2, md: 6, lg: 6 }} title="Your turn">
            <YourTurn
              items={[]}
              emptyAction={
                <Button variant="secondary" size="sm" className="w-fit">
                  Find a trip
                </Button>
              }
            />
          </BentoTile>
        </BentoGrid>
      </Section>
    </BenchShell>
  );
}
