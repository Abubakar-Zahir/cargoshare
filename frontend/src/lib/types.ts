// Frontend shapes live here; values and runtime logic stay in their own modules.
// Shapes the backend sends or expects come only from the generated schema, never by hand.
import type { components } from "@/lib/api/schema";
import type { ComponentProps, ReactNode } from "react";
import type { DARK_THEME, LIGHT_THEME } from "@/lib/constants";

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

export type ChildrenProps = Readonly<{ children: ReactNode }>;
export type ProfileProps = Readonly<{ profile: Profile }>;
export type AppShellProps = ChildrenProps & ProfileProps;
export type TravelerNavProps = Readonly<{ isTraveler: boolean }>;

export type NavItem = Readonly<{ label: string; href: string; available: boolean }>;
export type NavLinkProps = Readonly<{ item: NavItem; compact?: boolean }>;
export type EmptyStateProps = ChildrenProps & Readonly<{ title: string }>;

export type LoginPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export type AuthFormProps = Readonly<{
  action: (previous: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  fields: readonly AuthField[];
  submitLabel: string;
  hiddenValues?: Readonly<Record<string, string>>;
}>;

export type Theme = typeof LIGHT_THEME | typeof DARK_THEME;
export type ThemeToggleProps = Readonly<{
  lightLabel: string;
  darkLabel: string;
  lightTheme: Theme;
  darkTheme: Theme;
}>;

export type ButtonProps = ComponentProps<"button"> &
  Readonly<{ variant?: "primary" | "secondary" }>;
export type InputProps = ComponentProps<"input">;
export type FieldProps = ChildrenProps &
  Readonly<{
    id: string;
    label: string;
    hint?: string;
    hintId?: string;
  }>;
