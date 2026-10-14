import type { Metadata } from "next";

import { CapacityBar } from "@/components/domain/capacity-bar";
import { PerforatedDivider } from "@/components/domain/perforated-divider";
import { PriceBreakdown } from "@/components/domain/price-breakdown";
import { RatingStars } from "@/components/domain/rating-stars";
import { RouteCode, RouteInline } from "@/components/domain/route-code";
import { StatusStamp } from "@/components/domain/status-stamp";
import { TicketPass } from "@/components/domain/ticket-pass";
import { WeightTag } from "@/components/domain/weight-tag";
import { shipmentStatus, tripStatus } from "@/lib/status";

import { FlipDemo } from "../_components/bench-interactive";
import { BenchShell, Section } from "../_components/bench-shell";
import { myTrips } from "../_components/demo-data";

export const metadata: Metadata = {
  title: "Bench: tickets",
  robots: { index: false, follow: false },
};

export default function TicketsBenchPage() {
  return (
    <BenchShell current="/dev/bento/tickets" title="Tickets">
      <Section
        id="my-trips"
        title="My trips"
        description="The /trips page: one pass per row. The stub holds only the stamp, space left and rate; on narrow screens it moves below the perforation."
      >
        <ul className="flex max-w-3xl flex-col gap-6">
          {myTrips.map((trip) => (
            <li key={`${trip.origin}-${trip.departureDate}`}>
              <TicketPass {...trip} href="/trips" />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="search-pass"
        title="A pass in search results"
        description="Someone else's trip, with their verification shown."
      >
        <div className="max-w-sm">
          <TicketPass
            origin="Rahim Yar Khan"
            destination="Dera Ismail Khan"
            departureDate="2026-10-28"
            carrierName="Zara"
            carrierVerified
            remainingKg={6}
            totalKg={15}
            ratePerKg="799.5"
            status={tripStatus.active}
            href="/trips"
          />
        </div>
      </Section>

      <Section id="stamps" title="Stamps and routes">
        <div className="flex flex-wrap gap-4 py-1">
          {Object.entries(shipmentStatus).map(([key, status]) => (
            <StatusStamp key={key} status={status} />
          ))}
          {Object.entries(tripStatus).map(([key, status]) => (
            <StatusStamp key={`trip-${key}`} status={status} />
          ))}
        </div>
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <RouteCode origin="Lahore" destination="Karachi" labelled />
          <RouteCode origin="Rahim Yar Khan" destination="Dera Ismail Khan" />
          <RouteInline origin="Multan" destination="Lahore" />
        </div>
      </Section>

      <Section id="numbers" title="Prices, weights and numbers">
        <div className="grid max-w-4xl gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <PriceBreakdown weightKg={5} ratePerKg={800} total={4000} />
            <PriceBreakdown weightKg="2.5" ratePerKg="799.5" total="1998.75" />
            <p>
              Up to <WeightTag kg={50} /> per trip
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <CapacityBar remainingKg={20} totalKg={20} />
            <CapacityBar remainingKg="7.25" totalKg={20} />
            <CapacityBar remainingKg={0} totalKg={20} />
          </div>
          <div className="flex flex-col gap-3">
            <RatingStars value={4.8} count={23} />
            <RatingStars value={3.25} count={1} />
            <RatingStars value={null} />
          </div>
          <FlipDemo />
          <PerforatedDivider className="md:col-span-2" />
        </div>
      </Section>
    </BenchShell>
  );
}
