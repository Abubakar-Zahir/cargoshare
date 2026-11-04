"use server";

import { redirect } from "next/navigation";

import {
  HOME_PATH,
  LOGIN_INVALID_MESSAGE,
  LOGIN_PATH,
  LOGIN_REFUSED_MESSAGE,
  LOGIN_REFUSED_STATUS,
  LOGIN_UNAVAILABLE_MESSAGE,
} from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/server";
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

  const supabase = await createSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(credentials.data);
  if (error) {
    const refused = error.status === LOGIN_REFUSED_STATUS;
    return { error: refused ? LOGIN_REFUSED_MESSAGE : LOGIN_UNAVAILABLE_MESSAGE, email };
  }

  redirect(HOME_PATH);
};

export const logOut = async (): Promise<void> => {
  const supabase = await createSupabaseClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect(LOGIN_PATH);
};
