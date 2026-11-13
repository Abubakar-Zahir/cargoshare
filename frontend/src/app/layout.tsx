import "@/app/globals.css";

import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import ThemeToggle from "@/components/theme/theme-toggle";
import {
  APP_DESCRIPTION,
  APP_NAME,
  DARK_MODE_LABEL,
  DARK_THEME,
  DARK_THEME_COLOR,
  HOME_PATH,
  LIGHT_MODE_LABEL,
  LIGHT_THEME,
  LIGHT_THEME_COLOR,
} from "@/lib/constants";
import { getSavedTheme } from "@/lib/theme";

// Font options must stay written inline: Next.js reads them at build time without running this file.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  variable: "--font-fraunces",
});
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const generateViewport = async (): Promise<Viewport> => {
  const theme = await getSavedTheme();
  if (theme) {
    return { themeColor: theme === DARK_THEME ? DARK_THEME_COLOR : LIGHT_THEME_COLOR };
  }
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: LIGHT_THEME_COLOR },
      { media: "(prefers-color-scheme: dark)", color: DARK_THEME_COLOR },
    ],
  };
};

const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const theme = await getSavedTheme();

  return (
    <html
      lang="en"
      data-theme={theme ?? undefined}
      className={`${fraunces.variable} ${geistSans.variable}`}
    >
      <body className="flex min-h-svh flex-col font-sans">
        <header className="border-b border-line">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link
              href={HOME_PATH}
              className="font-display text-xl font-semibold text-ink no-underline"
            >
              {APP_NAME}
            </Link>
            <ThemeToggle
              lightLabel={LIGHT_MODE_LABEL}
              darkLabel={DARK_MODE_LABEL}
              lightTheme={LIGHT_THEME}
              darkTheme={DARK_THEME}
            />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
