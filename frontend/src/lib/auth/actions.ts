"use server";

import { redirect } from "next/navigation";

import { logInRequest, logOutRequest, resetPasswordRequest, signUpRequest } from "@/lib/api/client";
import { clearSession, getRefreshToken, saveSession } from "@/lib/auth/session";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_UNAVAILABLE_MESSAGE,
  HOME_PATH,
  LOGIN_INVALID_MESSAGE,
  LOGIN_PATH,
  NEXT_PARAM,
  PASSWORD_CHANGED_MESSAGE,
} from "@/lib/constants";
import {
  forgotPasswordSchema,
  loginSchema,
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

const messageFor = (code: string | undefined): string =>
  AUTH_ERROR_MESSAGES[code ?? ""] ?? AUTH_UNAVAILABLE_MESSAGE;

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

  const { data, code } = await logInRequest(credentials.data);
  if (!data) {
    return failure(messageFor(code), values);
  }

  await saveSession(data);
  redirect(safeNextPath(formData.get(NEXT_PARAM)));
};

export const signUp = async (
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values = keepValues(formData, [
    "username",
    "email",
    "date_of_birth",
    "is_sender",
    "is_traveler",
  ]);
  const details = signupSchema.safeParse({
    username: values.username,
    email: values.email,
    password: formData.get("password"),
    date_of_birth: values.date_of_birth,
    is_sender: "is_sender" in values,
    is_traveler: "is_traveler" in values,
  });
  if (!details.success) {
    return failure(details.error.issues[0]?.message ?? AUTH_UNAVAILABLE_MESSAGE, values);
  }

  const { data, code } = await signUpRequest(details.data);
  if (!data) {
    return failure(messageFor(code), values);
  }

  await saveSession(data);
  redirect(HOME_PATH);
};

export const resetPassword = async (
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const values = keepValues(formData, ["email"]);
  const details = forgotPasswordSchema.safeParse({
    email: values.email,
    date_of_birth: formData.get("date_of_birth"),
    new_password: formData.get("password"),
  });
  if (!details.success) {
    return failure(details.error.issues[0]?.message ?? AUTH_UNAVAILABLE_MESSAGE, values);
  }

  const { ok, code } = await resetPasswordRequest(details.data);
  if (!ok) {
    return failure(messageFor(code), values);
  }

  return { error: null, success: PASSWORD_CHANGED_MESSAGE, values: null };
};

export const logOut = async (): Promise<void> => {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    await logOutRequest(refreshToken);
  }
  await clearSession();
  redirect(LOGIN_PATH);
};
