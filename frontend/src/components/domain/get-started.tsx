import { cn } from "cn";
import { CheckIcon } from "lucide-react";
import type * as React from "react";

export interface GetStartedStep {
  id: string;
  title: string;
  description: string;
  done: boolean;
  action: React.ReactNode;
}

export function GetStarted({
  steps,
  className,
}: {
  steps: GetStartedStep[];
  className?: string;
}) {
  const doneCount = steps.filter((step) => step.done).length;
  if (doneCount === steps.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="get-started-title"
      data-slot="get-started"
      className={cn(
        "rounded-tile-sm border border-line bg-surface p-5 shadow-paper sm:rounded-tile sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="get-started-title" className="font-display text-title">
          Get started
        </h2>
        <p className="text-base text-ink-muted">
          {doneCount} of {steps.length} done
        </p>
      </div>
      <ol className="mt-4 divide-y divide-line">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 last:pb-0"
          >
            <span
              aria-hidden
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                step.done
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-line-strong",
              )}
            >
              {step.done && <CheckIcon className="size-4" strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1 basis-56">
              <p className={cn("font-medium", step.done && "text-ink-muted")}>
                {step.title}
                {step.done && <span className="sr-only">, done</span>}
              </p>
              {!step.done && (
                <p className="text-base text-ink-muted">{step.description}</p>
              )}
            </div>
            {!step.done && step.action}
          </li>
        ))}
      </ol>
    </section>
  );
}
