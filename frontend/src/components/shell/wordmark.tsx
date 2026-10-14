import { cn } from "cn";
import Link from "next/link";

export function Wordmark({
  href,
  compact = false,
  className,
}: {
  href: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      prefetch={false}
      href={href}
      className={cn("font-display text-2xl leading-none text-ink", className)}
    >
      {compact ? (
        <>
          <span aria-hidden>CS</span>
          <span className="sr-only">CargoShare</span>
        </>
      ) : (
        "CargoShare"
      )}
    </Link>
  );
}
