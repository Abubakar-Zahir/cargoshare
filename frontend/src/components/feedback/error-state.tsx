"use client";

import { cn } from "cn";

import { Button } from "@/components/ui/button";

export function ErrorState({
  title,
  fix,
  retryLabel = "Try again",
  onRetry,
  className,
}: {
  title: string;
  fix: string;
  retryLabel?: string;
  onRetry: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        "flex flex-col items-start gap-3 border-l-2 border-danger pl-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-danger">{title}</p>
        <p className="max-w-[52ch] text-base text-ink-muted">{fix}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
