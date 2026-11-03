import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import {
  CODE_PARAM,
  ERROR_PARAM,
  HOME_PATH,
  LINK_ERROR,
  LOGIN_PATH,
  RECOVERY_TYPE,
  RESET_PASSWORD_PATH,
} from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/server";

// The links in Supabase's emails land here after Supabase has checked them.
export const GET = async (request: NextRequest): Promise<never> => {
  const code = request.nextUrl.searchParams.get(CODE_PARAM);

  if (code) {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // The library returns redirectType, but its TypeScript types leave it out.
      const isRecovery = "redirectType" in data && data.redirectType === RECOVERY_TYPE;
      redirect(isRecovery ? RESET_PASSWORD_PATH : HOME_PATH);
    }
  }

  redirect(`${LOGIN_PATH}?${ERROR_PARAM}=${LINK_ERROR}`);
};
