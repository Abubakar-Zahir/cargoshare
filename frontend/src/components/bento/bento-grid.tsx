import { cn } from "cn";
import type * as React from "react";

import { spanClasses, type Span } from "./spans";

const gap = "gap-3 sm:gap-[14px] md:gap-4 lg:gap-[18px] xl:gap-5 2xl:gap-6";

export function BentoGrid({
  className,
  animateEntrance = false,
  ...props
}: React.ComponentProps<"div"> & { animateEntrance?: boolean }) {
  return (
    <div
      data-slot="bento-grid"
      className={cn(
        "grid grid-flow-row grid-cols-2 items-start sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
        gap,
        animateEntrance && "bento-stagger",
        className,
      )}
      {...props}
    />
  );
}

export function BentoColumn({
  span,
  className,
  ...props
}: React.ComponentProps<"div"> & { span: Span }) {
  return (
    <div
      data-slot="bento-column"
      className={cn(
        "flex min-w-0 flex-col",
        gap,
        ...spanClasses(span),
        className,
      )}
      {...props}
    />
  );
}
