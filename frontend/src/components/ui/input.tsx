import { cn } from "cn";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-control border border-line-strong bg-surface px-3 text-base text-ink transition-colors duration-150 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:bg-danger-soft/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
