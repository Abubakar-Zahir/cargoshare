import createClient from "openapi-fetch";

import { env } from "@/env";
import type { components, paths } from "@/lib/api/schema";
import {
  API_TIMEOUT_MILLISECONDS,
  LOGIN_API_PATH,
  LOGOUT_API_PATH,
  ME_PATH,
  REFRESH_API_PATH,
} from "@/lib/constants";

type Profile = components["schemas"]["ProfileResponse"];
type AccessToken = components["schemas"]["AccessTokenResponse"];

// ok is false when the backend refused, or could not be reached (then code is undefined).
type ApiResult<T> = Readonly<{ ok: boolean; data: T | undefined; code: string | undefined }>;

const api = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_API_URL });

const requestOptions = () => ({
  cache: "no-store" as const,
  signal: AbortSignal.timeout(API_TIMEOUT_MILLISECONDS),
});

const send = async <T>(
  call: () => Promise<{
    data?: T;
    error?: components["schemas"]["ErrorEnvelope"];
    response: Response;
  }>,
): Promise<ApiResult<T>> => {
  try {
    const { data, error, response } = await call();
    return { ok: response.ok, data, code: error?.error.code };
  } catch {
    return { ok: false, data: undefined, code: undefined };
  }
};

export const logInRequest = (body: components["schemas"]["LoginRequest"]) =>
  send(() => api.POST(LOGIN_API_PATH, { body, ...requestOptions() }));

export const logOutRequest = (refreshToken: string) =>
  send(() =>
    api.POST(LOGOUT_API_PATH, { body: { refresh_token: refreshToken }, ...requestOptions() }),
  );

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<AccessToken | undefined> => {
  const { data } = await send(() =>
    api.POST(REFRESH_API_PATH, { body: { refresh_token: refreshToken }, ...requestOptions() }),
  );
  return data;
};

// Returns null when the profile cannot be loaded, including when the backend is down.
export const getMyProfile = async (accessToken: string): Promise<Profile | null> => {
  const { data } = await send(() =>
    api.GET(ME_PATH, {
      headers: { Authorization: `Bearer ${accessToken}` },
      ...requestOptions(),
    }),
  );
  return data ?? null;
};
