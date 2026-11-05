"use server";

import { redirect } from "next/navigation";

import { logInRequest, logOutRequest } from "@/lib/api/client";
import { clearSession, getRefreshToken, saveSession } from "@/lib/auth/session";
import {
  AUTH_ERROR_MESSAGES,
  AUTH_UNAVAILABLE_MESSAGE,
  HOME_PATH,
  LOGIN_INVALID_MESSAGE,
  LOGIN_PATH,
} from "@/lib/constants";
import { loginSchema } from "@/lib/validation/auth";

export type LoginState = Readonly<{
  error: string | null;
  email: string;
}>;

export const logIn = async (_previous: LoginState, formData: FormData): Promise<LoginState> => {
  const submittedEmail = formData.get("email");
  const email = typeof submittedEmail === "string" ? submittedEmail : "";
  const credentials = loginSchema.safeParse({ email, password: formData.get("password") });
  if (!credentials.success) {
    return { error: LOGIN_INVALID_MESSAGE, email };
  }

  const { data, code } = await logInRequest(credentials.data);
  if (!data) {
    return { error: AUTH_ERROR_MESSAGES[code ?? ""] ?? AUTH_UNAVAILABLE_MESSAGE, email };
  }

  await saveSession(data);
  redirect(HOME_PATH);
};

export const logOut = async (): Promise<void> => {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    await logOutRequest(refreshToken);
  }
  await clearSession();
  redirect(LOGIN_PATH);
};
