import { z } from "zod";

const httpUrl = z.url({ protocol: /^https?$/ });

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: httpUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .startsWith("sb_publishable_", "must be a Supabase publishable key"),
  NEXT_PUBLIC_API_URL: httpUrl,
  NEXT_PUBLIC_SITE_URL: httpUrl,
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

type RawEnv = Readonly<Record<string, string | undefined>>;

const FORBIDDEN_NAME = /SERVICE_ROLE|SUPABASE_SECRET/i;
const SECRET_KEY_PREFIX = "sb_secret_";

function isServiceRoleJwt(value: string): boolean {
  const payload = value.split(".")[1];
  if (value.split(".").length !== 3 || payload === undefined) {
    return false;
  }
  try {
    const claims: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    return (
      typeof claims === "object" &&
      claims !== null &&
      "role" in claims &&
      claims.role === "service_role"
    );
  } catch {
    return false;
  }
}

export function findForbiddenEnv(env: RawEnv): string[] {
  return Object.entries(env)
    .filter(
      ([name, value]) =>
        FORBIDDEN_NAME.test(name) ||
        (value !== undefined &&
          (value.startsWith(SECRET_KEY_PREFIX) || isServiceRoleJwt(value))),
    )
    .map(([name]) => name)
    .sort();
}

export function assertBuildEnv(env: RawEnv): PublicEnv {
  const forbidden = findForbiddenEnv(env);
  if (forbidden.length > 0) {
    throw new Error(
      `Forbidden secrets in the frontend environment: ${forbidden.join(", ")}. The service role or secret key must never reach the frontend.`,
    );
  }
  const result = publicEnvSchema.safeParse(env);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid frontend environment: ${problems}`);
  }
  return result.data;
}
