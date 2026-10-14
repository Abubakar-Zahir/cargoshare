import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { collectConsoleProblems } from "./helpers";

const desktop = { width: 1280, height: 900 };
const phone = { width: 390, height: 844 };

test("desktop sidebar lists every destination with the requests count", async ({
  page,
}) => {
  const problems = collectConsoleProblems(page);
  await page.setViewportSize(desktop);
  await page.goto("/dev/shell");
  const nav = page.getByRole("navigation", { name: "Main" });
  const links = nav.getByRole("link");
  await expect(links).toHaveText([
    "Home",
    "Search",
    /^Requests\s*3$/,
    "My trips",
    "Shipments",
    "Wallet",
    "Profile",
  ]);
  await expect(nav.getByRole("link", { name: /Requests/ })).toHaveAttribute(
    "href",
    "/requests",
  );
  await expect(page.locator("[data-slot=bottom-nav]")).toBeHidden();
  expect(problems).toEqual([]);
});

test("the sidebar collapses to a labelled rail and remembers it", async ({
  page,
}) => {
  await page.setViewportSize(desktop);
  await page.goto("/dev/shell");
  const sidebar = page.locator("[data-slot=sidebar]");
  await expect(sidebar).toHaveAttribute("data-mode", "full");
  await page.getByRole("button", { name: "Collapse menu" }).click();
  await expect(sidebar).toHaveAttribute("data-mode", "rail");
  await expect(
    page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "My trips" }),
  ).toBeVisible();
  await page.reload();
  await expect(sidebar).toHaveAttribute("data-mode", "rail");
  await page.getByRole("button", { name: "Expand menu" }).click();
  await expect(sidebar).toHaveAttribute("data-mode", "full");
});

test("phone bottom nav has Post for people who carry and Send for people who only send", async ({
  page,
}) => {
  await page.setViewportSize(phone);
  await page.goto("/dev/shell");
  const bottom = page.locator("[data-slot=bottom-nav]");
  await expect(bottom).toBeVisible();
  await expect(
    bottom.getByRole("link", { name: "Home, 3 requests waiting" }),
  ).toBeVisible();
  await expect(bottom.getByRole("link")).toHaveText([
    /^3\s*Home$/,
    "Search",
    "Post",
    "Shipments",
    "Profile",
  ]);
  await expect(bottom.getByRole("link", { name: "Post" })).toHaveAttribute(
    "href",
    "/trips/new",
  );
  await expect(page.locator("[data-slot=sidebar]")).toBeHidden();

  await page.goto("/dev/shell?role=send");
  await expect(bottom.getByRole("link")).toHaveText([
    "Home",
    "Search",
    "Send",
    "Shipments",
    "Profile",
  ]);
  await expect(bottom.getByRole("link", { name: "Send" })).toHaveAttribute(
    "href",
    "/search",
  );
});

test("page content is never hidden behind the bottom nav", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/dev/shell");
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  const gap = await page.evaluate(() => {
    const nav = document.querySelector("[data-slot=bottom-nav]");
    const main = document.querySelector("main#main");
    const last = main?.lastElementChild;
    if (nav === null || last === null || last === undefined) {
      return -1;
    }
    return (
      nav.getBoundingClientRect().top - last.getBoundingClientRect().bottom
    );
  });
  expect(gap).toBeGreaterThanOrEqual(0);
});

test("the page is set up for iPhone safe areas", async ({ page }) => {
  await page.goto("/dev/shell");
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /viewport-fit=cover/,
  );
});

test("account menu offers profile, settings, appearance and sign out", async ({
  page,
}) => {
  await page.setViewportSize(phone);
  await page.goto("/dev/shell");
  const trigger = page.getByRole("button", {
    name: "Account menu for Sana Malik",
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(
    menu.getByRole("menuitem", { name: "Your profile" }),
  ).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Settings" })).toBeVisible();
  await menu.getByRole("menuitemradio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await trigger.click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/dev\/shell$/);
});

test("shell has no serious or critical axe violations at both sizes", async ({
  page,
}) => {
  for (const viewport of [desktop, phone]) {
    await page.setViewportSize(viewport);
    await page.goto("/dev/shell");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      ),
    ).toEqual([]);
  }
});

test("the phone top bar has a one-tap theme toggle", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize(phone);
  await page.goto("/dev/shell");
  const header = page.locator("header");
  await header.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await header.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
