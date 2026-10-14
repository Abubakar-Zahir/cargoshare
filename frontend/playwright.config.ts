import { defineConfig, devices } from "@playwright/test";

const port = 3200;
const isCI = process.env.CI === "true";
const matrixSpec = /bench-matrix\.spec\.ts/;
const visualSpec = /bench-visual\.spec\.ts/;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{testFileName}/{arg}-{projectName}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL: `http://localhost:${String(port)}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "pixel-7",
      testIgnore: matrixSpec,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "iphone-14",
      testIgnore: [matrixSpec, visualSpec],
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "desktop-1280",
      testIgnore: matrixSpec,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: "desktop-1920",
      testIgnore: [matrixSpec, visualSpec],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "breakpoints",
      testMatch: matrixSpec,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${String(port)}`,
    env: {
      CARGOSHARE_DEV_ROUTES: "true",
      NEXT_PUBLIC_SITE_URL: `http://localhost:${String(port)}`,
    },
    url: `http://localhost:${String(port)}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
