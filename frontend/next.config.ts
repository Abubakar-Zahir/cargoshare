import type { NextConfig } from "next";

import "@/env";
import { HSTS_HEADER, SECURITY_HEADERS } from "@/lib/constants";

const securityHeaders = [
  ...SECURITY_HEADERS,
  ...(process.env.NODE_ENV === "production" ? [HSTS_HEADER] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  headers() {
    return Promise.resolve([{ source: "/:path*", headers: securityHeaders }]);
  },
};

export default nextConfig;
