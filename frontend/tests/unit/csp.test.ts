import { describe, expect, it } from "vitest";

import { buildCsp, createNonce, type CspOptions } from "@/lib/security/csp";

const base: CspOptions = {
  nonce: "abc123",
  isDev: false,
  upgradeInsecureRequests: false,
  connectOrigins: ["https://api.test", "https://x.supabase.co"],
  imageOrigins: ["https://x.supabase.co"],
};

function directive(csp: string, name: string): string | undefined {
  return csp
    .split("; ")
    .find((entry) => entry === name || entry.startsWith(`${name} `));
}

describe("buildCsp", () => {
  it("uses the nonce for scripts and styles in production", () => {
    const csp = buildCsp(base);
    expect(directive(csp, "script-src")).toBe(
      "script-src 'self' 'nonce-abc123' 'strict-dynamic'",
    );
    expect(directive(csp, "style-src")).toBe("style-src 'self' 'nonce-abc123'");
    expect(directive(csp, "style-src-elem")).toBe(
      "style-src-elem 'self' 'nonce-abc123'",
    );
  });

  it("allows inline style attributes and nothing else unsafe", () => {
    const unsafe = buildCsp(base)
      .split("; ")
      .filter((entry) => entry.includes("unsafe"));
    expect(unsafe).toEqual(["style-src-attr 'unsafe-inline'"]);
  });

  it("limits connect-src and img-src to self plus the given origins", () => {
    const csp = buildCsp(base);
    expect(directive(csp, "connect-src")).toBe(
      "connect-src 'self' https://api.test https://x.supabase.co",
    );
    expect(directive(csp, "img-src")).toBe(
      "img-src 'self' blob: data: https://x.supabase.co",
    );
  });

  it("blocks framing, plugins and base or form hijacking", () => {
    const csp = buildCsp(base);
    expect(directive(csp, "frame-ancestors")).toBe("frame-ancestors 'none'");
    expect(directive(csp, "object-src")).toBe("object-src 'none'");
    expect(directive(csp, "base-uri")).toBe("base-uri 'self'");
    expect(directive(csp, "form-action")).toBe("form-action 'self'");
  });

  it("relaxes only what React needs in development", () => {
    const csp = buildCsp({ ...base, isDev: true });
    expect(directive(csp, "script-src")).toContain("'unsafe-eval'");
    expect(directive(csp, "style-src")).toBe(
      "style-src 'self' 'unsafe-inline'",
    );
    expect(directive(csp, "style-src-elem")).toBe(
      "style-src-elem 'self' 'unsafe-inline'",
    );
  });

  it("adds upgrade-insecure-requests only when asked", () => {
    expect(directive(buildCsp(base), "upgrade-insecure-requests")).toBe(
      undefined,
    );
    expect(
      directive(
        buildCsp({ ...base, upgradeInsecureRequests: true }),
        "upgrade-insecure-requests",
      ),
    ).toBe("upgrade-insecure-requests");
  });
});

describe("createNonce", () => {
  it("returns a fresh base64 value of 16 random bytes", () => {
    const first = createNonce();
    expect(first).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(createNonce()).not.toBe(first);
  });
});
