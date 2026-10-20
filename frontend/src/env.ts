// Checks the frontend's environment variables once, when the app starts or builds
// (next.config.ts imports this file), and stops with a clear error if:
// - one of the 4 public settings is missing or malformed, or
// - any Supabase secret / service role key is present (it would be exposed to browsers).
// Other files import `env` from here instead of reading process.env directly.
//
// Note: this file is loaded by next.config.ts, and Next.js compiles that chain without
// telling the compiler where each file is, so an "@/" import here would be resolved as
// if this file sat at the project root (src/src/...). That is why the constants import
// below is relative. Everywhere else we use "@/".
import { z } from "zod";

import {
  FORBIDDEN_ENV_VARIABLES,
  PUBLISHABLE_KEY_PREFIX,
  SECRET_KEY_PREFIX,
} from "./lib/constants"; // relative on purpose: see the note below

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().startsWith(PUBLISHABLE_KEY_PREFIX),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

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
        (FORBIDDEN_ENV_VARIABLES.includes(name) ||
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
