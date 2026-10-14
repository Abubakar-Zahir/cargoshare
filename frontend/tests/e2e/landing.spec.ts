import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { collectConsoleProblems, setTheme, themes } from "./helpers";

test("landing says what CargoShare is and offers both paths", async ({
  page,
}) => {
  const problems = collectConsoleProblems(page);
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Send it with someone already going.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const hero = page.getByRole("region", {
    name: "Send it with someone already going.",
  });
  await expect(
    hero.getByRole("link", { name: "Send something" }),
  ).toHaveAttribute("href", "/signup?intent=send");
  await expect(
    hero.getByRole("link", { name: "Carry something" }),
  ).toHaveAttribute("href", "/signup?intent=carry");

  for (const name of [
    "How it works",
    "You see the price before you ask",
    "Between the cities you already travel",
    "Why people trust it",
    "Which one are you today?",
    "Ready when you are.",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }

  await expect(
    page.getByText("5 kg at Rs 800 per kg, total Rs 4,000"),
  ).toBeAttached();
  expect(problems).toEqual([]);
});

test("every photo is described and actually loads", async ({ page }) => {
  await page.goto("/");
  const images = page.locator("main img");
  await expect(images).toHaveCount(3);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("alt", /.{20,}/);
    await expect
      .poll(() =>
        image.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0);
  }
});

for (const theme of themes) {
  test(`landing has no serious or critical axe violations (${theme})`, async ({
    page,
    context,
    baseURL,
  }) => {
    await setTheme(context, baseURL, theme);
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);
  });
}

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("the header toggle switches the theme everywhere and remembers it", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  const header = page.getByRole("banner");
  const barColour = page.locator(
    'meta[name="theme-color"][media="(prefers-color-scheme: light)"]',
  );
  const footerSwitcher = page.getByRole("group", { name: "Theme" });

  await header.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(barColour).toHaveAttribute("content", "#0f1319");
  await expect(
    footerSwitcher.getByRole("button", { name: "Dark" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    header.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeHidden();

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(barColour).toHaveAttribute("content", "#0f1319");

  await header.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await expect(
    footerSwitcher.getByRole("button", { name: "Light" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("the toggle shows the right button when the device is in dark mode", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(
    header.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await header.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    header.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeVisible();
});

test("theme buttons work before JavaScript loads", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Switch to dark theme" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("group", { name: "Theme" }).getByRole("button", {
      name: "Dark",
    }),
  ).toHaveAttribute("aria-pressed", "true");

  await page
    .getByRole("group", { name: "Theme" })
    .getByRole("button", { name: "System" })
    .click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
  await context.close();
});

test("going back shows the theme chosen on the later page", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.goto("/no-such-page");
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Switch to dark theme" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

for (const width of [320, 360, 390]) {
  test(`landing fits a ${String(width)}px phone with the header in one row`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const header = page.getByRole("banner");
    await expect(
      header.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeInViewport();
    await expect(header.getByRole("link", { name: "Log in" })).toBeInViewport();
    const box = await header.boundingBox();
    expect(box?.height).toBeLessThanOrEqual(65);
  });
}
