import { cn } from "cn";

import type { Decimal } from "@/lib/format/number";
import { formatKilograms } from "@/lib/format/weight";

export function WeightTag({
  kg,
  className,
}: {
  kg: Decimal;
  className?: string;
}) {
  return (
    <span data-slot="weight-tag" className={cn("whitespace-nowrap", className)}>
      <span className="font-mono tabular-nums">{formatKilograms(kg)}</span> kg
    </span>
  );
}
