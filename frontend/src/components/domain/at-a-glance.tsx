import { cn } from "cn";
import Link from "next/link";
import type * as React from "react";

export interface GlanceStat {
  id: string;
  label: string;
  value: React.ReactNode;
  href?: string;
}

export function AtAGlance({
  stats,
  className,
}: {
  stats: GlanceStat[];
  className?: string;
}) {
  return (
    <section
      aria-labelledby="at-a-glance-title"
      data-slot="at-a-glance"
      className={cn(
        "rounded-tile-sm border border-line bg-surface p-5 shadow-paper md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none",
        className,
      )}
    >
      <h2 id="at-a-glance-title" className="font-display text-title md:sr-only">
        At a glance
      </h2>
      <dl className="mt-2 flex flex-col divide-y divide-line md:mt-0 md:grid md:grid-cols-3 md:gap-4 md:divide-y-0 lg:gap-[18px] xl:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-baseline justify-between gap-4 py-3 last:pb-0 md:flex-col md:items-start md:justify-start md:gap-2 md:rounded-tile md:border md:border-line md:bg-surface md:p-6 md:shadow-paper"
          >
            <dt className="text-base text-ink-muted">{stat.label}</dt>
            <dd className="text-lg">
              {stat.href === undefined ? (
                stat.value
              ) : (
                <Link
                  prefetch={false}
                  href={stat.href}
                  className="underline-offset-4 hover:underline"
                >
                  {stat.value}
                  <span aria-hidden className="text-ink-muted">
                    {" "}
                    →
                  </span>
                </Link>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
