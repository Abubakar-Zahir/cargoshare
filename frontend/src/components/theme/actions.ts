"use server";

import { cookies, headers } from "next/headers";

import { parseTheme, THEME_COOKIE } from "@/lib/theme";

/**
 * Saves the theme when a theme button is pressed before the page's JavaScript
 * has loaded (slow network, or scripts blocked). Next.js then re-renders the
 * page with the new theme. Once JavaScript runs, the buttons switch instantly
 * on the device instead and never call this.
 */
export async function saveThemeAction(formData: FormData): Promise<void> {
  const value = formData.get("theme");
  const theme = parseTheme(typeof value === "string" ? value : undefined);
  const origin = (await headers()).get("origin") ?? "";
  (await cookies()).set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
    secure: origin.startsWith("https:"),
  });
}
