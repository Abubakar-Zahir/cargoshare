import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";
import type * as React from "react";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        neutral: "border-line bg-surface-2 text-ink",
        outline: "border-line-strong text-ink",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

function CountBadge({
  count,
  label,
  className,
}: {
  count: number;
  label?: string;
  className?: string;
}) {
  return (
    <span
      data-slot="count-badge"
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-sm font-semibold text-accent-ink tabular-nums",
        className,
      )}
    >
      {count}
      {label !== undefined && <span className="sr-only"> {label}</span>}
    </span>
  );
}

export { Badge, badgeVariants, CountBadge };
