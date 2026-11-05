import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/app/(auth)/login/login-form";
import { getAccessToken } from "@/lib/auth/session";
import { EMAIL_LABEL, HOME_PATH, LOG_IN_LABEL, LOGIN_TITLE, PASSWORD_LABEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: LOGIN_TITLE,
};

const LoginPage = async () => {
  if (await getAccessToken()) {
    redirect(HOME_PATH);
  }

  return (
    <main>
      <h1>{LOGIN_TITLE}</h1>
      <LoginForm
        emailLabel={EMAIL_LABEL}
        passwordLabel={PASSWORD_LABEL}
        submitLabel={LOG_IN_LABEL}
      />
    </main>
  );
};

export default LoginPage;
