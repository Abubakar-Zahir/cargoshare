import { describe, expect, it } from "vitest";

import { assertBuildEnv, findForbiddenEnv } from "@/lib/env/validate";

const validEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_123",
  NEXT_PUBLIC_API_URL: "http://localhost:8000/api/v1",
};

function jwtWithRole(role: string): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256" })}.${encode({ role })}.signature`;
}

describe("assertBuildEnv", () => {
  it("returns the public env when everything is valid", () => {
    expect(assertBuildEnv({ ...validEnv, PATH: "/usr/bin" })).toEqual(validEnv);
  });

  it.each(Object.keys(validEnv))("fails when %s is missing", (name) => {
    const env = Object.fromEntries(
      Object.entries(validEnv).filter(([key]) => key !== name),
    );
    expect(() => assertBuildEnv(env)).toThrow(name);
  });

  it("fails on a URL that is not http or https", () => {
    expect(() =>
      assertBuildEnv({ ...validEnv, NEXT_PUBLIC_API_URL: "ftp://api.test" }),
    ).toThrow("NEXT_PUBLIC_API_URL");
  });

  it("fails when the public key is not a publishable key", () => {
    expect(() =>
      assertBuildEnv({
        ...validEnv,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "eyJhbGciOi.anon.key",
      }),
    ).toThrow("must be a Supabase publishable key");
  });

  it("fails on a forbidden secret and never prints its value", () => {
    const run = () =>
      assertBuildEnv({
        ...validEnv,
        SUPABASE_SERVICE_ROLE_KEY: "super-secret-value",
      });
    expect(run).toThrow("SUPABASE_SERVICE_ROLE_KEY");
    expect(run).not.toThrow("super-secret-value");
  });
});

describe("findForbiddenEnv", () => {
  it.each([
    ["SUPABASE_SERVICE_ROLE_KEY", "anything"],
    ["next_public_service_role", "anything"],
    ["SUPABASE_SECRET_KEY", "anything"],
    ["INNOCENT_NAME", "sb_secret_abc"],
    ["INNOCENT_NAME", jwtWithRole("service_role")],
  ])("flags %s", (name, value) => {
    expect(findForbiddenEnv({ [name]: value })).toEqual([name]);
  });

  it.each([
    ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_abc"],
    ["SOME_TOKEN", jwtWithRole("anon")],
    ["SOME_VALUE", "a.b.c"],
    ["EMPTY", undefined],
  ])("allows %s", (name, value) => {
    expect(findForbiddenEnv({ [name]: value })).toEqual([]);
  });
});
