import { describe, expect, it } from "vitest";

import { shipmentStatus, stampTones, tripStatus } from "@/lib/status";

describe("status mapping", () => {
  it("uses plain words for shipment statuses", () => {
    expect(
      Object.fromEntries(
        Object.entries(shipmentStatus).map(([key, value]) => [
          key,
          value.label,
        ]),
      ),
    ).toEqual({
      pending: "Waiting for reply",
      accepted: "Accepted",
      in_transit: "On its way",
      delivered: "Delivered",
      rejected: "Declined",
      cancelled: "Cancelled",
      disputed: "Disputed",
    });
  });

  it("prints stamps in ink, fades finished ones and reserves red for disputes", () => {
    const stamps = (map: Record<string, { stamp: string }>) =>
      Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.stamp]));
    expect(stamps(shipmentStatus)).toEqual({
      pending: "ink",
      accepted: "ink",
      in_transit: "ink",
      delivered: "ink",
      rejected: "muted",
      cancelled: "muted",
      disputed: "danger",
    });
    expect(stamps(tripStatus)).toEqual({
      active: "ink",
      full: "ink",
      cancelled: "muted",
      completed: "muted",
    });
  });

  it("gives every status a label and a known stamp tone", () => {
    for (const style of [
      ...Object.values(shipmentStatus),
      ...Object.values(tripStatus),
    ]) {
      expect(style.label.length).toBeGreaterThan(0);
      expect(stampTones).toContain(style.stamp);
    }
  });
});
