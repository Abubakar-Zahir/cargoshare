import { cn } from "cn";
import Link from "next/link";
import type * as React from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { CountBadge } from "@/components/ui/badge";

export const MAX_TURN_ITEMS = 3;

export interface TurnItem {
  id: string;
  title: string;
  detail: string;
  href: string;
}

export function YourTurn({
  items,
  emptyAction,
  className,
}: {
  items: TurnItem[];
  emptyAction: React.ReactNode;
  className?: string;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing needs you right now"
        description="We'll put anything you need to do here: payments, requests, handoffs and ratings."
        action={emptyAction}
        className={className}
      />
    );
  }

  return (
    <ol
      data-slot="your-turn"
      className={cn("flex flex-col divide-y divide-line", className)}
    >
      {items.slice(0, MAX_TURN_ITEMS).map((item) => (
        <li key={item.id} className="[&:first-child>a]:pt-0">
          <Link
            prefetch={false}
            href={item.href}
            className="group flex min-h-12 items-start justify-between gap-4 rounded-control py-4 focus-visible:outline-offset-4"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium group-hover:underline group-hover:underline-offset-4">
                {item.title}
              </span>
              <span className="text-base text-ink-muted">{item.detail}</span>
            </span>
            <span aria-hidden className="pt-0.5 text-ink-muted">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function RequestsLink({ count, href }: { count: number; href: string }) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="inline-flex min-h-11 items-center gap-2 text-ink underline underline-offset-4"
    >
      See all requests
      <CountBadge count={count} label="waiting" />
    </Link>
  );
}
