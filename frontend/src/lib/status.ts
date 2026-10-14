export const stampTones = ["ink", "muted", "danger"] as const;

export type StampTone = (typeof stampTones)[number];

export interface StatusStyle {
  label: string;
  stamp: StampTone;
}

export const shipmentStatus = {
  pending: { label: "Waiting for reply", stamp: "ink" },
  accepted: { label: "Accepted", stamp: "ink" },
  in_transit: { label: "On its way", stamp: "ink" },
  delivered: { label: "Delivered", stamp: "ink" },
  rejected: { label: "Declined", stamp: "muted" },
  cancelled: { label: "Cancelled", stamp: "muted" },
  disputed: { label: "Disputed", stamp: "danger" },
} as const satisfies Record<string, StatusStyle>;

export const tripStatus = {
  active: { label: "Open", stamp: "ink" },
  full: { label: "Full", stamp: "ink" },
  cancelled: { label: "Cancelled", stamp: "muted" },
  completed: { label: "Completed", stamp: "muted" },
} as const satisfies Record<string, StatusStyle>;
