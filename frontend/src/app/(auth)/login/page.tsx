import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/app/(auth)/login/login-form";
import { EMAIL_LABEL, HOME_PATH, LOG_IN_LABEL, LOGIN_TITLE, PASSWORD_LABEL } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: LOGIN_TITLE,
};

const LoginPage = async () => {
  const supabase = await createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
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
