import { redirect } from "next/navigation";
import { connection } from "next/server";

import Welcome from "@/components/home/welcome";
import { getMyProfile } from "@/lib/api/client";
import { logOut } from "@/lib/auth/actions";
import { getAccessToken } from "@/lib/auth/session";
import {
  APP_NAME,
  LOG_OUT_LABEL,
  LOGIN_PATH,
  PROFILE_UNAVAILABLE_MESSAGE,
  SIGNED_IN_MESSAGE,
} from "@/lib/constants";

const HomePage = async () => {
  // Render on every request (not once at build time) so Next.js can stamp the
  // per-request CSP nonce from src/proxy.ts on the page's scripts.
  await connection();

  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect(LOGIN_PATH);
  }

  // The backend checks this token itself, so a forged cookie gets no profile.
  const profile = await getMyProfile(accessToken);
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
