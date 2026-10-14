import { expect, test } from "@playwright/test";

import {
  benchPages,
  overflowingElements,
  setTheme,
  themes,
  tilesWithEmptySpace,
} from "./helpers";

const widths = [360, 390, 430, 768, 1024, 1280, 1440, 1920] as const;

for (const path of [...benchPages, "/", "/dev/shell"]) {
  for (const theme of themes) {
    test(`${path} fits and tiles hug their content at every breakpoint (${theme})`, async ({
      page,
      context,
      baseURL,
    }) => {
      await setTheme(context, baseURL, theme);
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(path);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 800 });
        expect(
          await overflowingElements(page),
          `overflow at ${String(width)}px`,
        ).toEqual([]);
        expect(
          await tilesWithEmptySpace(page),
          `empty space at ${String(width)}px`,
        ).toEqual([]);
      }
    });
  }
}

test("bench fits on a landscape tablet and a short phone", async ({ page }) => {
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 375, height: 667 },
  ]) {
    await page.setViewportSize(viewport);
    for (const path of benchPages) {
      await page.goto(path);
      expect(await overflowingElements(page), path).toEqual([]);
    }
  }
});

test("landing and shell do not shift while loading", async ({ page }) => {
  for (const path of ["/", "/dev/shell"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const shift = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as (PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            })[]) {
              if (!entry.hadRecentInput) {
                total += entry.value;
              }
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => {
            resolve(total);
          }, 500);
        }),
    );
    expect(shift, path).toBeLessThan(0.05);
  }
});
