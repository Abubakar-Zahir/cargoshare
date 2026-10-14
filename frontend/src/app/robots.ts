import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env/public";

const privatePaths = [
  "/dashboard",
  "/search",
  "/requests",
  "/trips",
  "/shipments",
  "/disputes",
  "/wallet",
  "/profile",
  "/settings",
  "/verification",
  "/admin",
  "/dev",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: privatePaths },
    sitemap: new URL("/sitemap.xml", publicEnv.NEXT_PUBLIC_SITE_URL).toString(),
  };
}
