import { cn } from "cn";
import type * as React from "react";

function Ledger({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="ledger"
      className={cn("flex flex-col divide-y divide-line", className)}
      {...props}
    />
  );
}

function LedgerRow({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="ledger-row"
      className={cn("min-w-0 py-4 first:pt-0 last:pb-0", className)}
      {...props}
    />
  );
}

export { Ledger, LedgerRow };
