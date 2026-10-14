import { cn } from "cn";
import type * as React from "react";

const prefixes = {
  you: { text: "Your turn:", className: "font-semibold text-accent" },
  problem: { text: "Needs attention:", className: "font-semibold text-danger" },
  them: undefined,
  done: undefined,
} as const;

export type StatusLineTurn = keyof typeof prefixes;

export function StatusLine({
  turn,
  children,
  className,
}: {
  turn: StatusLineTurn;
  children: React.ReactNode;
  className?: string;
}) {
  const prefix = prefixes[turn];
  return (
    <p
      data-slot="status-line"
      data-turn={turn}
      className={cn(
        "text-base",
        turn === "them" || turn === "done" ? "text-ink-muted" : "text-ink",
        className,
      )}
    >
      {prefix !== undefined && (
        <span className={prefix.className}>{prefix.text} </span>
      )}
      {children}
    </p>
  );
}
