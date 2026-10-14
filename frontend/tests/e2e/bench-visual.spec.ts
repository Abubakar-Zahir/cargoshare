import { expect, test } from "@playwright/test";

import { setTheme, themes } from "./helpers";

for (const theme of themes) {
  test(`bench matches the visual snapshot (${theme})`, async ({
    page,
    context,
    baseURL,
  }) => {
    await setTheme(context, baseURL, theme);
    await page.goto("/dev/bento");
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`bench-${theme}.png`, {
      fullPage: true,
    });
  });
}
