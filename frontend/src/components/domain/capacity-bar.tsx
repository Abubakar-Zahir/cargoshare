import { cn } from "cn";

import { toNumber, type Decimal } from "@/lib/format/number";
import { formatKilograms } from "@/lib/format/weight";

export function CapacityBar({
  remainingKg,
  totalKg,
  className,
}: {
  remainingKg: Decimal;
  totalKg: Decimal;
  className?: string;
}) {
  const remaining = toNumber(remainingKg);
  const total = toNumber(totalKg);
  const share = total > 0 ? Math.min(Math.max(remaining / total, 0), 1) : 0;

  return (
    <div data-slot="capacity-bar" className={cn("grid gap-2", className)}>
      <p className="text-base">
        <span className="font-mono font-semibold tabular-nums">
          {formatKilograms(remaining)}
        </span>{" "}
        of{" "}
        <span className="font-mono tabular-nums">{formatKilograms(total)}</span>{" "}
        kg left
      </p>
      <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-ink"
          style={{ width: `${String(share * 100)}%` }}
        />
      </div>
    </div>
  );
}
