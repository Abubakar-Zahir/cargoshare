import Link from "next/link";
import { connection } from "next/server";

import Welcome from "@/components/home/welcome";
import { getMyProfile } from "@/lib/api/client";
import { logOut } from "@/lib/auth/actions";
import {
  APP_NAME,
  LOG_IN_LABEL,
  LOG_OUT_LABEL,
  LOGGED_OUT_MESSAGE,
  LOGIN_PATH,
  PROFILE_UNAVAILABLE_MESSAGE,
  SIGNED_IN_MESSAGE,
} from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/server";

const HomePage = async () => {
  // Render on every request (not once at build time) so Next.js can stamp the
  // per-request CSP nonce from src/proxy.ts on the page's scripts.
  await connection();

  const supabase = await createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <Welcome title={APP_NAME} message={LOGGED_OUT_MESSAGE}>
        <Link href={LOGIN_PATH}>{LOG_IN_LABEL}</Link>
      </Welcome>
    );
  }

  // The backend checks this token itself, so a forged cookie gets no profile.
  const profile = await getMyProfile(session.access_token);
  const message = profile
    ? `${SIGNED_IN_MESSAGE} ${profile.username}`
    : PROFILE_UNAVAILABLE_MESSAGE;

  return (
    <Welcome title={APP_NAME} message={message}>
      <form action={logOut}>
        <button type="submit">{LOG_OUT_LABEL}</button>
      </form>
    </Welcome>
  );
};

export default HomePage;
