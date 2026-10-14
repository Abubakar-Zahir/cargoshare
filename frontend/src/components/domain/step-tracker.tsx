import { cn } from "cn";
import { CheckIcon } from "lucide-react";

export const shipmentSteps = [
  "Requested",
  "Accepted",
  "Paid",
  "Picked up",
  "Delivered",
] as const;

export interface StepIssue {
  label: string;
  tone: "danger" | "muted";
}

export function StepTracker({
  completed,
  issue,
  className,
}: {
  completed: number;
  issue?: StepIssue;
  className?: string;
}) {
  const done = Math.min(Math.max(completed, 0), shipmentSteps.length);

  return (
    <div data-slot="step-tracker" className={cn("@container/steps", className)}>
      <ol className="flex flex-col gap-0 @xl/steps:flex-row">
        {shipmentSteps.map((step, index) => {
          const isDone = index < done;
          const isCurrent = index === done && issue === undefined;
          const isIssue = index === done && issue !== undefined;
          const isLast = index === shipmentSteps.length - 1;
          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className="relative flex flex-1 gap-3 pb-5 last:pb-0 @xl/steps:flex-col @xl/steps:gap-2 @xl/steps:pb-0"
            >
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-7 bottom-0 left-[11px] w-0.5 @xl/steps:top-[11px] @xl/steps:right-0 @xl/steps:bottom-auto @xl/steps:left-7 @xl/steps:h-0.5 @xl/steps:w-auto",
                    isDone && index + 1 < done ? "bg-ink" : "bg-line",
                  )}
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                  isDone && "border-ink bg-ink text-bg",
                  isCurrent && "border-accent bg-bg",
                  isIssue &&
                    (issue.tone === "danger"
                      ? "border-danger bg-danger"
                      : "border-ink-muted bg-ink-muted"),
                  !isDone &&
                    !isCurrent &&
                    !isIssue &&
                    "border-line-strong bg-bg",
                )}
              >
                {isDone && <CheckIcon className="size-3.5" strokeWidth={3} />}
                {isCurrent && (
                  <span className="size-2 rounded-full bg-accent" />
                )}
              </span>
              <span className="flex flex-col pt-0.5 @xl/steps:pt-0">
                <span
                  className={cn(
                    "text-sm",
                    isDone || isCurrent
                      ? "font-medium text-ink"
                      : "text-ink-muted",
                  )}
                >
                  {step}
                  {isDone && <span className="sr-only">, done</span>}
                  {isCurrent && <span className="sr-only">, next</span>}
                </span>
                {isIssue && (
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      issue.tone === "danger"
                        ? "text-danger"
                        : "text-ink-muted",
                    )}
                  >
                    {issue.label}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
