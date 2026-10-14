import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";

import { publicEnv } from "@/lib/env/public";
import { NonceRegistrar } from "@/components/security/nonce-registrar";
import {
  parseTheme,
  THEME_COOKIE,
  themeAttribute,
  themeColorFor,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  // SOFT is left out: its default (0) is what we use, so it only adds bytes.
  // WONK defaults to on, so it stays and font-display turns it off.
  axes: ["opsz", "WONK"],
  variable: "--font-fraunces",
});
const sans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "CargoShare: send it with someone already going",
    template: "%s · CargoShare",
  },
  description:
    "Send small things with people already travelling between Pakistan's cities, or earn from your spare luggage space.",
  applicationName: "CargoShare",
  openGraph: {
    type: "website",
    siteName: "CargoShare",
    locale: "en_PK",
  },
  twitter: { card: "summary_large_image" },
};

export async function generateViewport(): Promise<Viewport> {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);
  return {
    viewportFit: "cover",
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: themeColorFor(theme, "light"),
      },
      {
        media: "(prefers-color-scheme: dark)",
        color: themeColorFor(theme, "dark"),
      },
    ],
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      data-theme={themeAttribute(theme)}
      className={cn(display.variable, sans.variable, mono.variable)}
    >
      <body>
        <NonceRegistrar nonce={nonce} />
        {children}
      </body>
    </html>
  );
}
