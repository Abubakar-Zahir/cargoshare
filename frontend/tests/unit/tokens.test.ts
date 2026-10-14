import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { themeColors } from "@/lib/theme";

import {
  contrast,
  parseOklch,
  toLinearRgb,
  type Oklch,
  type Rgb,
} from "./color";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): Map<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) {
    throw new Error(`Missing block ${selector}`);
  }
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return new Map(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
      ([, name = "", value = ""]) => [name, value.trim()],
    ),
  );
}

const themes = {
  light: block(":root"),
  dark: block(':root[data-theme="dark"]'),
};
const systemDark = block(':root:not([data-theme="light"])');

function color(theme: Map<string, string>, name: string): Oklch {
  const value = theme.get(`--${name}`);
  if (value === undefined) {
    throw new Error(`Missing token --${name}`);
  }
  return parseOklch(value);
}

const textPairs: [string, string][] = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["ink", "surface-2"],
  ["ink-muted", "bg"],
  ["ink-muted", "surface"],
  ["ink-muted", "surface-2"],
  ["bg", "ink"],
  ["accent", "bg"],
  ["accent", "surface"],
  ["accent", "accent-soft"],
  ["accent-ink", "accent"],
  ["danger", "bg"],
  ["danger", "surface"],
  ["danger", "danger-soft"],
];

const uiPairs: [string, string][] = [
  ["ring", "bg"],
  ["ring", "surface"],
  ["ring", "surface-2"],
  ["line-strong", "bg"],
  ["line-strong", "surface"],
];

function ratio(theme: Map<string, string>, fg: string, bg: string): number {
  return contrast(toLinearRgb(color(theme, fg)), toLinearRgb(color(theme, bg)));
}

describe("design tokens", () => {
  it("defines the same tokens in light and dark", () => {
    expect([...themes.dark.keys()].sort()).toEqual(
      [...themes.light.keys()].sort(),
    );
  });

  it("paints the phone browser bar the same colour as the page", () => {
    for (const name of ["light", "dark"] as const) {
      const hex = themeColors[name];
      const rgb = [1, 3, 5].map((i) => {
        const channel = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      }) as Rgb;
      expect(
        contrast(rgb, toLinearRgb(color(themes[name], "bg"))),
      ).toBeLessThan(1.02);
    }
  });

  it("keeps the system dark block identical to the manual dark block", () => {
    expect(Object.fromEntries(systemDark)).toEqual(
      Object.fromEntries(themes.dark),
    );
  });

  for (const [mode, theme] of Object.entries(themes)) {
    describe(`${mode} mode`, () => {
      it.each(textPairs)("%s on %s meets 4.5:1 for text", (fg, bg) => {
        expect(ratio(theme, fg, bg)).toBeGreaterThanOrEqual(4.5);
      });

      it.each(uiPairs)("%s against %s meets 3:1 for UI", (fg, bg) => {
        expect(ratio(theme, fg, bg)).toBeGreaterThanOrEqual(3);
      });

      it("keeps secondary text comfortably readable (7:1) on every surface", () => {
        for (const surface of ["bg", "surface"]) {
          expect(ratio(theme, "ink-muted", surface)).toBeGreaterThanOrEqual(7);
        }
      });
    });
  }
});
