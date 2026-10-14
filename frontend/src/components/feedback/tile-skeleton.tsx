import { cn } from "cn";

import { spanClasses, type Span } from "@/components/bento/spans";
import { Skeleton } from "@/components/ui/skeleton";

export function TileSkeleton({
  span,
  lines = 3,
  label = "Loading",
  className,
}: {
  span?: Span;
  lines?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      data-slot="tile-skeleton"
      className={cn(
        "flex min-w-0 flex-col gap-4 overflow-hidden rounded-tile-sm border border-line bg-surface p-5 sm:rounded-tile sm:p-6",
        span !== undefined && spanClasses(span),
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      <Skeleton className="h-7 w-1/2" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
    </div>
  );
}
