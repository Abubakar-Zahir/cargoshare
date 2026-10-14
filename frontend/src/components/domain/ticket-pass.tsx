import type * as React from "react";

import { cn } from "cn";
import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";

import { formatDay } from "@/lib/format/date";
import type { Decimal } from "@/lib/format/number";
import type { StatusStyle } from "@/lib/status";

import { CapacityBar } from "./capacity-bar";
import { PerforatedDivider } from "./perforated-divider";
import { PriceTag } from "./price-tag";
import { RouteCode } from "./route-code";
import { StatusStamp } from "./status-stamp";

export interface TicketPassProps {
  origin: string;
  destination: string;
  departureDate: string;
  carrierName: string;
  carrierVerified: boolean;
  remainingKg: Decimal;
  totalKg: Decimal;
  ratePerKg: Decimal;
  status: StatusStyle;
  href?: string;
  className?: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="truncate text-base font-medium">{children}</dd>
    </div>
  );
}

export function TicketPass({
  origin,
  destination,
  departureDate,
  carrierName,
  carrierVerified,
  remainingKg,
  totalKg,
  ratePerKg,
  status,
  href,
  className,
}: TicketPassProps) {
  const body = (
    <div className="grid @lg/pass:grid-cols-[minmax(0,1fr)_auto_minmax(11rem,14rem)]">
      <div className="flex min-w-0 flex-col gap-5 p-5 sm:p-6">
        <p className="text-sm text-ink-muted">CargoShare · Trip pass</p>
        <RouteCode
          origin={origin}
          destination={destination}
          size="lg"
          labelled
        />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Field label="Date">{formatDay(departureDate)}</Field>
          <Field label="Carried by">
            <span className="inline-flex items-center gap-1.5">
              {carrierName}
              {carrierVerified && (
                <>
                  <BadgeCheckIcon aria-hidden className="size-4 text-accent" />
                  <span className="sr-only">, ID verified</span>
                </>
              )}
            </span>
          </Field>
        </dl>
      </div>
      <PerforatedDivider notches className="@lg/pass:hidden" />
      <PerforatedDivider
        orientation="vertical"
        notches
        className="hidden @lg/pass:block"
      />
      <div className="flex min-w-0 flex-col gap-5 p-5 sm:p-6">
        <StatusStamp status={status} className="self-start" />
        <dl className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <dt className="text-sm text-ink-muted">Space left</dt>
            <dd>
              <CapacityBar remainingKg={remainingKg} totalKg={totalKg} />
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-sm text-ink-muted">Rate</dt>
            <dd className="text-base">
              <PriceTag amount={ratePerKg} /> per kg
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  const shell = cn(
    "@container/pass relative block min-w-0 overflow-hidden rounded-tile-sm border border-line bg-surface text-ink shadow-paper sm:rounded-tile",
    href !== undefined &&
      "transition-[translate,box-shadow] duration-250 ease-soft hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-offset-[-4px]",
    className,
  );

  if (href !== undefined) {
    return (
      <Link
        prefetch={false}
        href={href}
        data-slot="ticket-pass"
        className={shell}
      >
        {body}
      </Link>
    );
  }
  return (
    <article data-slot="ticket-pass" className={shell}>
      {body}
    </article>
  );
}
