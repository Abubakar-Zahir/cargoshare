import { cn } from "cn";

import { cityCode } from "@/lib/format/route-code";

const sizeClasses = {
  sm: { code: "text-base", name: "text-sm", arrow: "text-base" },
  md: { code: "text-2xl", name: "text-sm", arrow: "text-xl" },
  lg: { code: "text-4xl @md:text-5xl", name: "text-base", arrow: "text-3xl" },
} as const;

function City({
  name,
  label,
  size,
  align,
}: {
  name: string;
  label: string | undefined;
  size: keyof typeof sizeClasses;
  align: "start" | "end";
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-col gap-1",
        align === "end" ? "items-end text-right" : "items-start",
      )}
    >
      {label !== undefined && (
        <span className="text-sm text-ink-muted">{label}</span>
      )}
      <span
        className={cn(
          "font-mono leading-none font-semibold tracking-wide",
          sizeClasses[size].code,
        )}
      >
        {cityCode(name)}
      </span>
      <span
        title={name}
        className={cn(
          "max-w-full truncate text-ink-muted",
          sizeClasses[size].name,
        )}
      >
        {name}
      </span>
    </span>
  );
}

export function RouteInline({
  origin,
  destination,
  className,
}: {
  origin: string;
  destination: string;
  className?: string;
}) {
  return (
    <span
      data-slot="route-inline"
      className={cn(
        "inline-flex min-w-0 flex-wrap items-baseline gap-x-2",
        className,
      )}
    >
      <span aria-hidden className="font-mono font-semibold tracking-wide">
        {cityCode(origin)} → {cityCode(destination)}
      </span>
      <span className="truncate text-ink-muted">
        {origin} to {destination}
      </span>
    </span>
  );
}

export function RouteCode({
  origin,
  destination,
  size = "md",
  labelled = false,
  className,
}: {
  origin: string;
  destination: string;
  size?: keyof typeof sizeClasses;
  labelled?: boolean;
  className?: string;
}) {
  return (
    <span
      data-slot="route-code"
      className={cn(
        "grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4",
        className,
      )}
    >
      <span className="sr-only">
        {origin} to {destination}
      </span>
      <span aria-hidden className="contents">
        <City
          name={origin}
          label={labelled ? "From" : undefined}
          size={size}
          align="start"
        />
        <span
          className={cn("font-mono text-ink-muted", sizeClasses[size].arrow)}
        >
          →
        </span>
        <City
          name={destination}
          label={labelled ? "To" : undefined}
          size={size}
          align="end"
        />
      </span>
    </span>
  );
}
