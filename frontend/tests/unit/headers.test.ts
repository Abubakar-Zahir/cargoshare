import { describe, expect, it } from "vitest";

import { securityHeaders } from "@/lib/security/headers";

const asRecord = (isProduction: boolean) =>
  Object.fromEntries(
    securityHeaders(isProduction).map(({ key, value }) => [key, value]),
  );

describe("securityHeaders", () => {
  it("sets the baseline headers in every environment", () => {
    expect(asRecord(false)).toEqual({
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
  });

  it("adds HSTS in production only", () => {
    expect(asRecord(true)["Strict-Transport-Security"]).toBe(
      "max-age=63072000; includeSubDomains; preload",
    );
  });
});
