import type { MetadataRoute } from "next";
import { env } from "@/env";
const sitemap = (): MetadataRoute.Sitemap => [
  { url: new URL("/", env.NEXT_PUBLIC_SITE_URL).href, changeFrequency: "monthly", priority: 1 },
];
export default sitemap;
