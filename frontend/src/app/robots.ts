import type { MetadataRoute } from "next";
import { env } from "@/env";
import { PROTECTED_PATH_PREFIXES } from "@/lib/constants";
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: [...PROTECTED_PATH_PREFIXES, "/login", "/signup", "/forgot-password"],
  },
  sitemap: new URL("/sitemap.xml", env.NEXT_PUBLIC_SITE_URL).href,
});
export default robots;
