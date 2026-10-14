"use client";

import { cn } from "cn";
import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react";

import { formatMoney } from "@/lib/format/money";
import { formatWeight } from "@/lib/format/weight";

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

const formatters = {
  money: formatMoney,
  weight: formatWeight,
  plain: (value: number) => new Intl.NumberFormat("en-PK").format(value),
} as const;

export function FlipNumber({
  value,
  kind = "plain",
  className,
}: {
  value: number;
  kind?: keyof typeof formatters;
  className?: string;
}) {
  const reduceMotion = useReducedMotionConfig() ?? false;
  const text = formatters[kind](value);

  return (
    <span
      data-slot="flip-number"
      className={cn("inline-flex font-mono tabular-nums", className)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex overflow-hidden">
        {reduceMotion
          ? text
          : Array.from(segmenter.segment(text), ({ segment }) => segment).map(
              (character, index) => (
                <span
                  key={`${String(index)}-${String(text.length)}`}
                  className="relative inline-block"
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.span
                      key={character}
                      className="inline-block whitespace-pre"
                      initial={{ y: "-100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "100%", opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      {character}
                    </motion.span>
                  </AnimatePresence>
                </span>
              ),
            )}
      </span>
    </span>
  );
}
