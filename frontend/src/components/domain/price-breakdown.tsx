import { cn } from "cn";

import { formatMoney } from "@/lib/format/money";
import type { Decimal } from "@/lib/format/number";
import { formatWeight } from "@/lib/format/weight";

import { PriceTag } from "./price-tag";
import { WeightTag } from "./weight-tag";

export function PriceBreakdown({
  weightKg,
  ratePerKg,
  total,
  className,
}: {
  weightKg: Decimal;
  ratePerKg: Decimal;
  total: Decimal;
  className?: string;
}) {
  return (
    <p data-slot="price-breakdown" className={cn("text-base", className)}>
      <span className="sr-only">
        {formatWeight(weightKg)} at {formatMoney(ratePerKg)} per kg, total{" "}
        {formatMoney(total)}
      </span>
      <span aria-hidden>
        <WeightTag kg={weightKg} /> ×{" "}
        <PriceTag amount={ratePerKg} className="[&>span]:font-normal" /> ={" "}
        <PriceTag amount={total} />
      </span>
    </p>
  );
}
