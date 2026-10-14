import { cn } from "cn";
import { StarIcon } from "lucide-react";

const scoreFormat = new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function RatingStars({
  value,
  count,
  className,
}: {
  value: number | null;
  count?: number;
  className?: string;
}) {
  if (value === null) {
    return (
      <span
        data-slot="rating-stars"
        className={cn("text-base text-ink-muted", className)}
      >
        No ratings yet
      </span>
    );
  }

  const score = Math.min(Math.max(value, 0), 5);
  const countText =
    count === undefined
      ? ""
      : ` (${String(count)} ${count === 1 ? "rating" : "ratings"})`;

  return (
    <span
      data-slot="rating-stars"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span className="sr-only">
        Rated {scoreFormat.format(score)} out of 5{countText}
      </span>
      <span aria-hidden className="relative inline-flex">
        <span className="flex text-line">
          {[0, 1, 2, 3, 4].map((index) => (
            <StarIcon key={index} className="size-4" />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 flex overflow-hidden text-ink"
          style={{ width: `${String((score / 5) * 100)}%` }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <StarIcon key={index} className="size-4 shrink-0 fill-current" />
          ))}
        </span>
      </span>
      <span
        aria-hidden
        className="font-mono text-base font-semibold tabular-nums"
      >
        {scoreFormat.format(score)}
        {count !== undefined && (
          <span className="font-normal text-ink-muted"> ({count})</span>
        )}
      </span>
    </span>
  );
}
