// Shared shapes used by more than one file. Values live in constants.ts; shapes live here.
// Shapes the backend sends or expects come only from the generated schema, never by hand.
import type { components } from "@/lib/api/schema";

type Schemas = components["schemas"];

export type Profile = Schemas["ProfileResponse"];
export type AccessToken = Schemas["AccessTokenResponse"];
export type TokenPair = Schemas["TokenPairResponse"];
export type ErrorEnvelope = Schemas["ErrorEnvelope"];
export type SignupRequest = Schemas["SignupRequest"];
export type LoginRequest = Schemas["LoginRequest"];
export type ResetPasswordRequest = Schemas["ResetPasswordRequest"];

// ok is false when the backend refused, or could not be reached (then code is undefined).
export type ApiResult<T> = Readonly<{ ok: boolean; data: T | undefined; code: string | undefined }>;

// One box in a sign-in form. The form draws whatever list of these it is given.
export type AuthField = Readonly<{
  name: string;
  label: string;
  type: "text" | "email" | "password" | "date" | "checkbox";
  autoComplete?: string;
  hint?: string;
  defaultChecked?: boolean;
}>;

// What a sign-in form action returns: an error, a success message, and the values to refill.
export type AuthFormState = Readonly<{
  error: string | null;
  success: string | null;
  values: Readonly<Record<string, string>> | null;
}>;
