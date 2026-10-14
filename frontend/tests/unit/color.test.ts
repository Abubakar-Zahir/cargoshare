import { describe, expect, it } from "vitest";

import { contrast, parseOklch, toLinearRgb } from "./color";

describe("color helpers", () => {
  it("converts white and black exactly", () => {
    for (const channel of toLinearRgb(parseOklch("oklch(1 0 0)"))) {
      expect(channel).toBeCloseTo(1, 4);
    }
    expect(toLinearRgb(parseOklch("oklch(0 0 0)"))).toEqual([0, 0, 0]);
  });

  it("gives 21:1 for black on white", () => {
    expect(
      contrast(
        toLinearRgb(parseOklch("oklch(0 0 0)")),
        toLinearRgb(parseOklch("oklch(1 0 0)")),
      ),
    ).toBeCloseTo(21, 1);
  });

  it("parses alpha", () => {
    expect(parseOklch("oklch(0.17 0.015 260 / 0.85)").alpha).toBe(0.85);
  });
});
