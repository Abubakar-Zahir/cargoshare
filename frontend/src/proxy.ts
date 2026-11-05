import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import { getMyProfile, refreshAccessToken } from "@/lib/api/client";
import { sessionCookieOptions } from "@/lib/auth/session";
import {
  ACCESS_TOKEN_COOKIE,
  COOKIE_HEADER,
  CSP_DEV_SCRIPT_SOURCE,
  CSP_FIXED_DIRECTIVES,
  CSP_HEADER,
  CSP_UPGRADE_INSECURE_REQUESTS,
  NONCE_HEADER,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/constants";

const contentSecurityPolicy = (nonce: string): string => {
  const isDev = process.env.NODE_ENV === "development";
  const directives = [
    ...CSP_FIXED_DIRECTIVES,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? ` ${CSP_DEV_SCRIPT_SOURCE}` : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `connect-src 'self' ${new URL(env.NEXT_PUBLIC_API_URL).origin}`,
  ];
  if (env.NEXT_PUBLIC_SITE_URL.startsWith("https://")) {
    directives.push(CSP_UPGRADE_INSECURE_REQUESTS);
  }
  return directives.join("; ");
};

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NONCE_HEADER, nonce);
  requestHeaders.set(CSP_HEADER, csp);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // Asks the backend, so a forged cookie does not count as logged in.
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isLoggedIn = accessToken !== undefined && (await getMyProfile(accessToken)) !== null;

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!isLoggedIn && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed) {
      // The page must see the new token too, not only the browser.
      request.cookies.set(ACCESS_TOKEN_COOKIE, refreshed.access_token);
      requestHeaders.set(COOKIE_HEADER, request.cookies.toString());
      response = NextResponse.next({ request: { headers: requestHeaders } });
      response.cookies.set(
        ACCESS_TOKEN_COOKIE,
        refreshed.access_token,
        sessionCookieOptions(refreshed.access_expires_in),
      );
    }
  }

  response.headers.set(CSP_HEADER, csp);
  return response;
};

// Must stay written inline: Next.js reads `config` at build time without running this file,
// so values imported from the constants file would be ignored ("matcher values need to be
// constants so they can be statically analyzed at build-time").
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
