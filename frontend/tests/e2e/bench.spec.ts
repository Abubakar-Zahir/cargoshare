import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  benchPages,
  collectConsoleProblems,
  setTheme,
  themes,
} from "./helpers";

for (const path of benchPages) {
  for (const theme of themes) {
    test(`${path} has no serious or critical axe violations (${theme})`, async ({
      page,
      context,
      baseURL,
    }) => {
      await setTheme(context, baseURL, theme);
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      );
      expect(blocking).toEqual([]);
    });
  }
}

test("bench pages are linked from a nav that marks the current page", async ({
  page,
}) => {
  await page.goto("/dev/bento");
  const nav = page.getByRole("navigation", { name: "Bench pages" });
  await expect(nav.getByRole("link")).toHaveCount(benchPages.length + 1);
  await nav.getByRole("link", { name: "Lists" }).click();
  await expect(page).toHaveURL(/\/dev\/bento\/lists$/);
  await expect(nav.getByRole("link", { name: "Lists" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("dashboard shows at most three things that need you", async ({ page }) => {
  await page.goto("/dev/bento");
  const returning = page.getByRole("region", { name: "Returning user" });
  await expect(returning.locator("[data-slot=your-turn] > li")).toHaveCount(3);
  await expect(
    returning.getByRole("link", { name: /See all requests/ }),
  ).toHaveAttribute("href", "/requests");
});

test("the chosen theme is in the server HTML, so there is no flash", async ({
  request,
}) => {
  const dark = await request.get("/dev/bento", {
    headers: { cookie: "theme=dark" },
  });
  expect(await dark.text()).toMatch(/<html[^>]*data-theme="dark"/);

  const system = await request.get("/dev/bento");
  expect(await system.text()).not.toMatch(/<html[^>]*data-theme=/);
});

test("system theme follows the OS colour scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/dev/bento");
  const darkBackground = await page.evaluate(
    () => getComputedStyle(document.documentElement).backgroundColor,
  );
  await page.emulateMedia({ colorScheme: "light" });
  const lightBackground = await page.evaluate(
    () => getComputedStyle(document.documentElement).backgroundColor,
  );
  expect(darkBackground).not.toBe(lightBackground);
});

test("theme switcher changes the theme and remembers it", async ({ page }) => {
  await page.goto("/dev/bento");
  const switcher = page.getByRole("group", { name: "Theme" });
  await expect(
    switcher.getByRole("button", { name: "System" }),
  ).toHaveAttribute("aria-pressed", "true");

  await switcher.getByRole("button", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(switcher.getByRole("button", { name: "Dark" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(switcher.getByRole("button", { name: "Dark" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await switcher.getByRole("button", { name: "Light" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await switcher.getByRole("button", { name: "System" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
});

test("the review hub links every page to check", async ({ page }) => {
  await page.goto("/dev");
  for (const name of ["Public pages", "App shell", "Design bench"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  const main = page.getByRole("main");
  for (const href of [
    "/",
    "/no-such-page",
    "/dev/shell",
    "/dev/shell?role=send",
    "/dev/shell?requests=0",
    "/dev/bento",
    "/dev/bento/tickets",
    "/dev/bento/lists",
    "/dev/bento/forms-and-buttons",
    "/dev/bento/states",
  ]) {
    await expect(main.locator(`a[href="${href}"]`)).toHaveCount(1);
  }
  await main.getByRole("link", { name: /^Sends only/ }).click();
  await expect(page).toHaveURL(/\/dev\/shell\?role=send$/);
});

test("declining a request asks for confirmation and returns focus", async ({
  page,
}) => {
  await page.goto("/dev/bento/lists");
  const requests = page.getByRole("region", { name: "Requests" });
  const decline = requests.getByRole("button", { name: "Decline" }).first();
  await decline.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Decline Bilal's request?" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Decline request" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(decline).toBeFocused();
});

test("overlays work by keyboard, return focus and keep the console clean", async ({
  page,
}) => {
  const problems = collectConsoleProblems(page);
  await page.goto("/dev/bento/forms-and-buttons");

  for (const [trigger, title] of [
    ["Cancel trip…", "Cancel this trip?"],
    ["Open drawer", "Filters"],
    ["Open sheet", "Menu"],
  ] as const) {
    const button = page.getByRole("button", { name: trigger });
    await button.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: title });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator(":focus")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  }

  const menuButton = page.getByRole("button", { name: "More actions" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Edit" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();

  await page.getByRole("button", { name: "Show toast" }).click();
  await expect(page.getByText("Request sent")).toBeVisible();

  expect(problems).toEqual([]);
});

test("a linked tile is one link with a visible focus ring", async ({
  page,
}) => {
  await page.goto("/dev/bento/forms-and-buttons");
  const link = page.getByRole("link", { name: /A whole tile can be one link/ });
  await link.focus();
  expect(
    await link.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
});
