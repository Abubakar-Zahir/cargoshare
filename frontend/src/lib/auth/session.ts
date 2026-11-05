import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/constants";

type TokenPair = Readonly<{
  access_token: string;
  access_expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}>;

// httpOnly: scripts in the page can never read these, so a script attack cannot steal them.
export const sessionCookieOptions = (maxAge: number) =>
  ({
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  }) as const;

export const saveSession = async (tokens: TokenPair): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(
    ACCESS_TOKEN_COOKIE,
    tokens.access_token,
    sessionCookieOptions(tokens.access_expires_in),
  );
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refresh_token,
    sessionCookieOptions(tokens.refresh_expires_in),
  );
};

export const clearSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
};

export const getAccessToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
};
