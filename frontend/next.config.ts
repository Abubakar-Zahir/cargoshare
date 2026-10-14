import type { NextConfig } from "next";

import { assertBuildEnv } from "./src/lib/env/validate";
import { securityHeaders } from "./src/lib/security/headers";

assertBuildEnv(process.env);

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
