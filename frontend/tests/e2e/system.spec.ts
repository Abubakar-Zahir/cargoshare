import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("unknown pages get a helpful 404", async ({ page }) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("status of 404")
    ) {
      problems.push(message.text());
    }
  });
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "We couldn't find that page.",
  );
  await expect(
    page.getByRole("link", { name: "Go to the home page" }),
  ).toHaveAttribute("href", "/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter(
      (violation) =>
        violation.impact === "serious" || violation.impact === "critical",
    ),
  ).toEqual([]);
  expect(problems).toEqual([]);
});

test("robots.txt keeps private pages out of search and points to the sitemap", async ({
  request,
  baseURL,
}) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Allow: /");
  for (const path of ["/dashboard", "/requests", "/admin", "/dev"]) {
    expect(body).toContain(`Disallow: ${path}`);
  }
  expect(body).toContain(`Sitemap: ${String(baseURL)}/sitemap.xml`);
});

test("sitemap lists the public home page", async ({ request, baseURL }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  expect(body).toContain(`<loc>${String(baseURL)}/</loc>`);
});

test("pages share an Open Graph image", async ({ page, request }) => {
  await page.goto("/");
  const image = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(image).not.toBeNull();
  const response = await request.get(new URL(image ?? "").pathname);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("image/png");
});
