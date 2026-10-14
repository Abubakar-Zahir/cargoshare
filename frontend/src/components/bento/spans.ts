export type BaseSpan = 1 | 2;
export type SmSpan = 1 | 2 | 3 | 4;
export type MdSpan = 1 | 2 | 3 | 4 | 5 | 6;
export type LgSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Span {
  base: BaseSpan;
  sm?: SmSpan;
  md: MdSpan;
  lg: LgSpan;
}

const colBase = { 1: "col-span-1", 2: "col-span-2" } as const;
const colSm = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
} as const;
const colMd = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
} as const;
const colLg = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
} as const;

export function spanClasses(span: Span): string[] {
  return [
    colBase[span.base],
    colSm[span.sm ?? (span.base === 1 ? 2 : 4)],
    colMd[span.md],
    colLg[span.lg],
  ];
}
