import createClient from "openapi-fetch";

import { env } from "@/env";
import type { components, paths } from "@/lib/api/schema";
import { API_TIMEOUT_MILLISECONDS, ME_PATH } from "@/lib/constants";

type Profile = components["schemas"]["ProfileResponse"];

const api = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_API_URL });

// Returns null when the profile cannot be loaded, including when the backend is down.
export const getMyProfile = async (accessToken: string): Promise<Profile | null> => {
  try {
    const { data } = await api.GET(ME_PATH, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(API_TIMEOUT_MILLISECONDS),
    });
    return data ?? null;
  } catch {
    return null;
  }
};
