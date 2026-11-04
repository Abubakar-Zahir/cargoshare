import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import {
  COOKIE_HEADER,
  CSP_DEV_SCRIPT_SOURCE,
  CSP_FIXED_DIRECTIVES,
  CSP_HEADER,
  CSP_UPGRADE_INSECURE_REQUESTS,
  NONCE_HEADER,
} from "@/lib/constants";

const contentSecurityPolicy = (nonce: string): string => {
  const isDev = process.env.NODE_ENV === "development";
  const directives = [
    ...CSP_FIXED_DIRECTIVES,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? ` ${CSP_DEV_SCRIPT_SOURCE}` : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `connect-src 'self' ${new URL(env.NEXT_PUBLIC_API_URL).origin} ${new URL(env.NEXT_PUBLIC_SUPABASE_URL).origin}`,
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

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, cacheHeaders) => {
          // The page must see the refreshed session too, not only the browser.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          requestHeaders.set(COOKIE_HEADER, request.cookies.toString());
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(cacheHeaders).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    },
  );

  // Refreshes an expired session. It writes the new cookies through setAll above.
  await supabase.auth.getUser();

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
