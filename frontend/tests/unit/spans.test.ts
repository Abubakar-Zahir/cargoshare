import { describe, expect, it } from "vitest";

import { spanClasses } from "@/components/bento/spans";

describe("spanClasses", () => {
  it("maps every breakpoint and doubles the base span at sm", () => {
    expect(spanClasses({ base: 1, md: 3, lg: 4 })).toEqual([
      "col-span-1",
      "sm:col-span-2",
      "md:col-span-3",
      "lg:col-span-4",
    ]);
  });

  it("honours an explicit sm span", () => {
    expect(spanClasses({ base: 2, sm: 3, md: 6, lg: 8 })).toEqual([
      "col-span-2",
      "sm:col-span-3",
      "md:col-span-6",
      "lg:col-span-8",
    ]);
  });

  it("never sets row spans, so tiles size to their content", () => {
    expect(spanClasses({ base: 2, md: 6, lg: 12 }).join(" ")).not.toMatch(
      /row-span/,
    );
  });
});
