import { cn } from "cn";
import type * as React from "react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "animate-shimmer rounded-control bg-linear-to-r from-surface-2 via-line to-surface-2 bg-size-[200%_100%]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
