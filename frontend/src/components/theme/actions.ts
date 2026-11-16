"use server";

import { cookies } from "next/headers";

import { THEME_COOKIE, THEME_COOKIE_MAX_AGE_SECONDS, THEME_FIELD } from "@/lib/constants";
import { isTheme } from "@/lib/theme";

export const saveTheme = async (formData: FormData): Promise<void> => {
  const theme = formData.get(THEME_FIELD);
  if (!isTheme(theme)) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE, theme, {
    httpOnly: true,
    maxAge: THEME_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};
