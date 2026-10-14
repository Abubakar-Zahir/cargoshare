import type { Metadata } from "next";

import { BentoTile } from "@/components/bento/bento-tile";
import { formatDay } from "@/lib/format/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BenchShell, Section } from "../_components/bench-shell";
import { carrying, requestsByTrip, sending } from "../_components/demo-data";
import { RequestLedger, ShipmentLedger } from "../_components/demo-rows";

export const metadata: Metadata = {
  title: "Bench: lists",
  robots: { index: false, follow: false },
};

export default function ListsBenchPage() {
  return (
    <BenchShell current="/dev/bento/lists" title="Lists">
      <Section
        id="requests"
        title="Requests"
        description="The /requests page: every request on your trips, grouped by trip, soonest departure first. Accept and Decline are labelled; Decline asks first."
      >
        <div className="flex max-w-3xl flex-col gap-6">
          {requestsByTrip.map((trip) => (
            <BentoTile
              key={trip.id}
              headingLevel={3}
              title={`${trip.origin} → ${trip.destination}`}
              description={`${formatDay(trip.departureDate)} · ${String(trip.requests.length)} waiting`}
            >
              <RequestLedger requests={trip.requests} />
            </BentoTile>
          ))}
        </div>
      </Section>

      <Section
        id="shipments"
        title="Shipments"
        description="The /shipments page: two tabs. Every row says what happens next and who has to act."
      >
        <Tabs defaultValue="sending" className="max-w-3xl">
          <TabsList aria-label="Shipments">
            <TabsTrigger value="sending">Sending</TabsTrigger>
            <TabsTrigger value="carrying">Carrying</TabsTrigger>
          </TabsList>
          <TabsContent value="sending">
            <BentoTile headingLevel={3} title="Things you're sending">
              <ShipmentLedger shipments={sending} />
            </BentoTile>
          </TabsContent>
          <TabsContent value="carrying">
            <BentoTile headingLevel={3} title="Things you're carrying">
              <ShipmentLedger shipments={carrying} />
            </BentoTile>
          </TabsContent>
        </Tabs>
      </Section>
    </BenchShell>
  );
}
