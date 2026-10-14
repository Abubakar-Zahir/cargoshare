import { describe, expect, it } from "vitest";

import { formatDay } from "@/lib/format/date";
import { formatMoney } from "@/lib/format/money";
import { cityCode } from "@/lib/format/route-code";
import { formatWeight } from "@/lib/format/weight";

describe("formatMoney", () => {
  it.each([
    [4000, "Rs 4,000"],
    ["4000.00", "Rs 4,000"],
    ["4000.5", "Rs 4,000.50"],
    [1234567.891, "Rs 1,234,567.89"],
    [0, "Rs 0"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatMoney(value)).toBe(expected);
  });

  it("rejects values that are not numbers", () => {
    expect(() => formatMoney("abc")).toThrow(RangeError);
  });
});

describe("formatWeight", () => {
  it.each([
    [5, "5 kg"],
    ["2.50", "2.5 kg"],
    ["12.25", "12.25 kg"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatWeight(value)).toBe(expected);
  });
});

describe("formatDay", () => {
  it("shows the date in Asia/Karachi", () => {
    expect(formatDay("2026-10-12T20:30:00Z")).toBe("Tue, 13 Oct");
    expect(formatDay("2026-10-12T05:00:00Z")).toBe("Mon, 12 Oct");
  });
});

describe("cityCode", () => {
  it.each([
    ["Lahore", "LHE"],
    ["karachi", "KHI"],
    ["  Rahim Yar Khan ", "RYK"],
    ["Dera Ismail Khan", "DSK"],
  ])("uses the airport code for %s", (name, code) => {
    expect(cityCode(name)).toBe(code);
  });

  it.each([
    ["Chitral", "CHI"],
    ["Murree", "MUR"],
    ["Uch", "UCH"],
    ["Ay", "AYX"],
  ])("derives a code for %s", (name, code) => {
    expect(cityCode(name)).toBe(code);
  });
});
