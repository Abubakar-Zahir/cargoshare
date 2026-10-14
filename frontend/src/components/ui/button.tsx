import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";
import type * as React from "react";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-control border border-transparent font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 ease-soft select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-ink hover:bg-accent/90",
        secondary:
          "border-line-strong bg-surface text-ink hover:bg-surface-2 aria-expanded:bg-surface-2",
        text: "px-2 text-ink underline-offset-4 hover:underline",
        danger: "border-danger bg-transparent text-danger hover:bg-danger-soft",
        "on-accent": "bg-accent-ink text-accent hover:bg-accent-ink/90",
      },
      size: {
        sm: "h-10 px-3.5 text-base pointer-coarse:h-12",
        md: "h-11 px-4 text-base pointer-coarse:h-12",
        lg: "h-12 px-5 text-base",
        icon: "size-11 pointer-coarse:size-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}

export { Button, buttonVariants };
