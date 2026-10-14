import { afterEach, describe, expect, it } from "vitest";

import {
  applyTheme,
  parseTheme,
  readTheme,
  syncTheme,
  themeAttribute,
  themeColorFor,
  themeColors,
  themeCookie,
} from "@/lib/theme";

describe("parseTheme", () => {
  it.each(["light", "dark", "system"] as const)("accepts %s", (theme) => {
    expect(parseTheme(theme)).toBe(theme);
  });

  it.each([undefined, "", "DARK", "blue", "dark; path=/"])(
    "falls back to system for %s",
    (value) => {
      expect(parseTheme(value)).toBe("system");
    },
  );
});

describe("themeAttribute", () => {
  it("omits the attribute for system so CSS follows the OS", () => {
    expect(themeAttribute("system")).toBeUndefined();
    expect(themeAttribute("dark")).toBe("dark");
  });
});

describe("themeCookie", () => {
  it("persists for a year and is secure on https", () => {
    expect(themeCookie("dark", true)).toBe(
      "theme=dark; path=/; max-age=31536000; samesite=lax; secure",
    );
    expect(themeCookie("light", false)).not.toContain("secure");
  });
});

describe("themeColorFor", () => {
  it("paints the browser bar to match the choice, or the device for system", () => {
    expect(themeColorFor("dark", "light")).toBe(themeColors.dark);
    expect(themeColorFor("light", "dark")).toBe(themeColors.light);
    expect(themeColorFor("system", "dark")).toBe(themeColors.dark);
    expect(themeColorFor("system", "light")).toBe(themeColors.light);
  });
});

describe("applyTheme", () => {
  afterEach(() => {
    applyTheme("system");
    document.head.innerHTML = "";
  });

  it("updates the browser bar colour and the saved choice", () => {
    document.head.innerHTML = [
      '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9f5ed">',
      '<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f1319">',
    ].join("");
    applyTheme("dark");
    const metas = [...document.querySelectorAll("meta")].map((m) => m.content);
    expect(metas).toEqual([themeColors.dark, themeColors.dark]);
    expect(readTheme()).toBe("dark");

    applyTheme("system");
    expect(
      [...document.querySelectorAll("meta")].map((m) => m.content),
    ).toEqual([themeColors.light, themeColors.dark]);
  });

  it("re-reads the saved choice when a page comes back into view", () => {
    applyTheme("dark");
    document.cookie = "theme=light; path=/";
    syncTheme();
    expect(document.documentElement.dataset.theme).toBe("light");
    document.cookie = "theme=system; path=/";
    syncTheme();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("sets and clears the html data-theme attribute", () => {
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.cookie).toContain("theme=dark");
    applyTheme("system");
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(document.cookie).toContain("theme=system");
  });
});
