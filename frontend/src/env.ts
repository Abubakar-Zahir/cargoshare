import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().startsWith("sb_publishable_"),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

const FORBIDDEN_VARIABLES = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"];
const SECRET_KEY_PREFIX = "sb_secret_";

const isServiceRoleJwt = (value: string): boolean => {
  const parts = value.split(".");
  const payload = parts[1];
  if (parts.length !== 3 || payload === undefined) {
    return false;
  }
  try {
    const claims: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return (
      typeof claims === "object" &&
      claims !== null &&
      "role" in claims &&
      claims.role === "service_role"
    );
  } catch {
    return false;
  }
};

export const findSecretKeys = (source: NodeJS.ProcessEnv): string[] =>
  Object.entries(source)
    .filter(
      ([name, value]) =>
        value !== undefined &&
        (FORBIDDEN_VARIABLES.includes(name) ||
          value.startsWith(SECRET_KEY_PREFIX) ||
          isServiceRoleJwt(value)),
    )
    .map(([name]) => name);

export const loadPublicEnv = (source: NodeJS.ProcessEnv): PublicEnv => {
  const secretKeys = findSecretKeys(source);
  if (secretKeys.length > 0) {
    throw new Error(
      `Secret Supabase keys must never be in the frontend environment. Remove: ${secretKeys.join(", ")}`,
    );
  }
  const result = publicEnvSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid frontend environment:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
};

export const env = loadPublicEnv(process.env);
