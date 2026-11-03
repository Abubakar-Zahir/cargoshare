"use server";

import type { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { env } from "@/env";
import {
  AUTH_CALLBACK_PATH,
  AUTH_ERROR_MESSAGES,
  AUTH_UNAVAILABLE_MESSAGE,
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  HOME_PATH,
  LOGIN_INVALID_MESSAGE,
  LOGIN_PATH,
  LOGIN_REFUSED_MESSAGE,
  LOGIN_REFUSED_STATUS,
  NEXT_PARAM,
  SIGNUP_SUCCESS_MESSAGE,
} from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  safeNextPath,
  signupSchema,
} from "@/lib/validation/auth";

export type AuthFormState = Readonly<{
  error: string | null;
  success: string | null;
  values: Readonly<Record<string, string>> | null;
}>;

// Only the fields named here go back to the form, so a password is never sent back.
const keepValues = (formData: FormData, names: readonly string[]): Record<string, string> => {
  const values: Record<string, string> = {};
  names.forEach((name) => {
    const value = formData.get(name);
    if (typeof value === "string") {
      values[name] = value;
    }
  });
  return values;
};

// Must match the Redirect URL in Supabase exactly, so it carries no query string.
const callbackUrl = (): string => new URL(AUTH_CALLBACK_PATH, env.NEXT_PUBLIC_SITE_URL).toString();

const messageFor = (error: AuthError): string =>
  AUTH_ERROR_MESSAGES[error.code ?? ""] ?? AUTH_UNAVAILABLE_MESSAGE;

const failure = (error: string, values: Record<string, string>): AuthFormState => ({
  error,
  success: null,
  values,
});

export const logIn = async (
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values = keepValues(formData, ["email"]);
  const credentials = loginSchema.safeParse({
    email: values.email,
    password: formData.get("password"),
  });
  if (!credentials.success) {
    return failure(LOGIN_INVALID_MESSAGE, values);
  }

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(credentials.data);
  if (error) {
    const refused = error.status === LOGIN_REFUSED_STATUS;
    return failure(refused ? LOGIN_REFUSED_MESSAGE : messageFor(error), values);
  }

  redirect(safeNextPath(formData.get(NEXT_PARAM)));
};

export const signUp = async (
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values = keepValues(formData, ["username", "email", "is_sender", "is_traveler"]);
  const details = signupSchema.safeParse({
    username: values.username,
    email: values.email,
    password: formData.get("password"),
    is_sender: "is_sender" in values,
    is_traveler: "is_traveler" in values,
  });
  if (!details.success) {
    return failure(details.error.issues[0]?.message ?? AUTH_UNAVAILABLE_MESSAGE, values);
  }

  const { email, password, username, is_sender, is_traveler } = details.data;
  const supabase = await createSupabaseClient();
  // The database trigger handle_new_user reads this data to create the profile.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, is_sender, is_traveler }, emailRedirectTo: callbackUrl() },
  });
  if (error) {
    return failure(messageFor(error), values);
  }

  return { error: null, success: SIGNUP_SUCCESS_MESSAGE, values: null };
};

export const requestPasswordReset = async (
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values = keepValues(formData, ["email"]);
  const details = forgotPasswordSchema.safeParse({ email: values.email });
  if (!details.success) {
    return failure(details.error.issues[0]?.message ?? AUTH_UNAVAILABLE_MESSAGE, values);
  }

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(details.data.email, {
    redirectTo: callbackUrl(),
  });
  if (error) {
    return failure(messageFor(error), values);
  }

  return { error: null, success: FORGOT_PASSWORD_SUCCESS_MESSAGE, values: null };
};

export const resetPassword = async (
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const details = resetPasswordSchema.safeParse({ password: formData.get("password") });
  if (!details.success) {
    return failure(details.error.issues[0]?.message ?? AUTH_UNAVAILABLE_MESSAGE, {});
  }

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: details.data.password });
  if (error) {
    return failure(messageFor(error), {});
  }

  redirect(HOME_PATH);
};

export const logOut = async (): Promise<void> => {
  const supabase = await createSupabaseClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect(LOGIN_PATH);
};
