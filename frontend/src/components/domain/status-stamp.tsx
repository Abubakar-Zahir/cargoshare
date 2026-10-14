import { cn } from "cn";

import type { StampTone, StatusStyle } from "@/lib/status";

const toneClasses: Record<StampTone, string> = {
  ink: "border-ink/80 text-ink",
  muted: "border-ink-muted text-ink-muted",
  danger: "border-danger text-danger",
};

export function StatusStamp({
  status,
  className,
}: {
  status: StatusStyle;
  className?: string;
}) {
  return (
    <span
      data-slot="status-stamp"
      className={cn(
        "inline-block w-fit shrink-0 -rotate-3 rounded-[4px] border-[3px] border-double ink-worn px-2.5 py-1 font-mono text-sm leading-none font-semibold tracking-[0.12em] whitespace-nowrap uppercase",
        toneClasses[status.stamp],
        className,
      )}
    >
      {status.label}
    </span>
  );
}
