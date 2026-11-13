import { cookies } from "next/headers";

import { DARK_THEME, LIGHT_THEME, THEME_COOKIE } from "@/lib/constants";

export type Theme = typeof LIGHT_THEME | typeof DARK_THEME;

export const isTheme = (value: unknown): value is Theme =>
  value === LIGHT_THEME || value === DARK_THEME;

// Null means no saved choice, so the page follows the device's setting.
export const getSavedTheme = async (): Promise<Theme | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE)?.value;
  return isTheme(value) ? value : null;
};
