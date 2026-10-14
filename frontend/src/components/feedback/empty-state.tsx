import { cn } from "cn";
import type * as React from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-start gap-3", className)}
    >
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium">{title}</p>
        <p className="max-w-[52ch] text-base text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
