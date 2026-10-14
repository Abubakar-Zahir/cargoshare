import type { BrowserContext, Page } from "@playwright/test";

export const themes = ["light", "dark"] as const;

export const benchPages = [
  "/dev",
  "/dev/bento",
  "/dev/bento/tickets",
  "/dev/bento/lists",
  "/dev/bento/forms-and-buttons",
  "/dev/bento/states",
] as const;

export async function setTheme(
  context: BrowserContext,
  baseURL: string | undefined,
  theme: (typeof themes)[number],
) {
  await context.addCookies([
    { name: "theme", value: theme, url: baseURL ?? "http://localhost" },
  ]);
}

export function collectConsoleProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(message.text());
    }
  });
  page.on("pageerror", (error) => problems.push(error.message));
  return problems;
}

const boxes =
  "[data-slot=bento-tile], [data-slot=tile-skeleton], [data-slot=ticket-pass], [data-slot=get-started], [data-slot=at-a-glance]";

export async function overflowingElements(page: Page): Promise<string[]> {
  return page.evaluate((selector) => {
    const found: string[] = [];
    const root = document.documentElement;
    if (root.scrollWidth > root.clientWidth) {
      found.push(
        `document ${String(root.scrollWidth)}>${String(root.clientWidth)}`,
      );
    }
    document.querySelectorAll<HTMLElement>(selector).forEach((box, index) => {
      if (box.scrollWidth > box.clientWidth + 1) {
        const title = box.querySelector("h2, h3")?.textContent ?? "untitled";
        found.push(`box ${String(index)} (${title})`);
      }
    });
    return found;
  }, boxes);
}

export async function tilesWithEmptySpace(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const found: string[] = [];
    document
      .querySelectorAll<HTMLElement>("[data-slot=bento-tile]")
      .forEach((tile, index) => {
        const body = tile.firstElementChild;
        if (body === null) {
          return;
        }
        const gap =
          tile.getBoundingClientRect().height -
          body.getBoundingClientRect().height;
        if (gap > 2) {
          const title = tile.querySelector("h2, h3")?.textContent ?? "untitled";
          found.push(`tile ${String(index)} (${title}) +${gap.toFixed(0)}px`);
        }
      });
    return found;
  });
}
