import type { NextConfig } from "next";

import { assertBuildEnv } from "./src/lib/env/validate";
import { securityHeaders } from "./src/lib/security/headers";

assertBuildEnv(process.env);

const includeDevRoutes =
  process.env.NODE_ENV !== "production" ||
  process.env.CARGOSHARE_DEV_ROUTES === "true";

// Next.js blocks its dev scripts for any host but localhost, so a phone opening
// http://<computer's IP>:3000 would get a page that never hydrates. In
// development only, allow private network addresses (home and office Wi-Fi,
// WSL) and *.local names, plus any host listed in CARGOSHARE_DEV_ORIGINS.
function devOrigins(): string[] {
  const privateRanges = [
    "10.*.*.*",
    "192.168.*.*",
    ...Array.from({ length: 16 }, (_, i) => `172.${String(16 + i)}.*.*`),
    "*.local",
  ];
  const extra = (process.env.CARGOSHARE_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return [...privateRanges, ...extra];
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  // The floating dev badge sits on top of the phone bottom nav.
  devIndicators: false,
  allowedDevOrigins:
    process.env.NODE_ENV === "production" ? undefined : devOrigins(),
  // AVIF is roughly half the size of WebP for the landing photos; browsers
  // without it get WebP.
  images: { formats: ["image/avif", "image/webp"] },
  pageExtensions: includeDevRoutes ? ["tsx", "ts", "dev.tsx"] : ["tsx", "ts"],
  distDir:
    process.env.CARGOSHARE_DEV_ROUTES === "true" ? ".next-bench" : ".next",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  headers() {
    return Promise.resolve([
      {
        source: "/(.*)",
        headers: securityHeaders(process.env.NODE_ENV === "production"),
      },
    ]);
  },
};

export default nextConfig;
