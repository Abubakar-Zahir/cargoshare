import { cn } from "cn";

import { formatAmount } from "@/lib/format/money";
import type { Decimal } from "@/lib/format/number";

export function PriceTag({
  amount,
  perKg = false,
  className,
}: {
  amount: Decimal;
  perKg?: boolean;
  className?: string;
}) {
  return (
    <span data-slot="price-tag" className={cn("whitespace-nowrap", className)}>
      Rs{" "}
      <span className="font-mono font-semibold tabular-nums">
        {formatAmount(amount)}
      </span>
      {perKg && <span className="text-ink-muted"> per kg</span>}
    </span>
  );
}
