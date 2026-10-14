"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { PriceBreakdown } from "@/components/domain/price-breakdown";
import { RouteInline } from "@/components/domain/route-code";
import { StatusLine } from "@/components/domain/status-line";
import { StatusStamp } from "@/components/domain/status-stamp";
import { WeightTag } from "@/components/domain/weight-tag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ledger, LedgerRow } from "@/components/ui/ledger";
import { formatDay } from "@/lib/format/date";

import type { DemoRequest, DemoShipment } from "./demo-data";

export function RequestLedger({ requests }: { requests: DemoRequest[] }) {
  const [declining, setDeclining] = useState<DemoRequest | null>(null);
  const declineButton = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Ledger>
        {requests.map((request) => (
          <LedgerRow key={request.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-medium">{request.item}</p>
              <p className="text-base text-ink-muted">from {request.sender}</p>
            </div>
            <PriceBreakdown
              weightKg={request.weightKg}
              ratePerKg={request.ratePerKg}
              total={request.total}
            />
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="text"
                size="sm"
                onClick={(event) => {
                  declineButton.current = event.currentTarget;
                  setDeclining(request);
                }}
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toast(`You accepted ${request.sender}'s request`, {
                    description: `${request.sender} can now pay to confirm.`,
                  });
                }}
              >
                Accept
              </Button>
            </div>
          </LedgerRow>
        ))}
      </Ledger>
      <Dialog
        open={declining !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeclining(null);
          }
        }}
      >
        <DialogContent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            declineButton.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              Decline {declining?.sender}&apos;s request?
            </DialogTitle>
            <DialogDescription>
              {declining?.sender} will be told, and the {declining?.weightKg} kg
              goes back to your trip.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Keep request</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="danger">Decline request</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ShipmentLedger({ shipments }: { shipments: DemoShipment[] }) {
  return (
    <Ledger>
      {shipments.map((shipment) => (
        <LedgerRow key={shipment.id} className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <RouteInline
              origin={shipment.origin}
              destination={shipment.destination}
            />
            <StatusStamp status={shipment.status} />
          </div>
          <p className="font-medium">
            {shipment.item}
            <span className="font-normal text-ink-muted">
              {" "}
              · <WeightTag kg={shipment.weightKg} /> ·{" "}
              {formatDay(shipment.date)}
            </span>
          </p>
          <StatusLine turn={shipment.turn}>{shipment.next}</StatusLine>
        </LedgerRow>
      ))}
    </Ledger>
  );
}
