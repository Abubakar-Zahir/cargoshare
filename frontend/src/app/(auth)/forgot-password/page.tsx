import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import AuthForm from "@/components/auth/auth-form";
import { resetPassword } from "@/lib/auth/actions";
import {
  FORGOT_PASSWORD_FIELDS,
  FORGOT_PASSWORD_TITLE,
  HAVE_ACCOUNT_LABEL,
  LOGIN_PATH,
  SAVE_PASSWORD_LABEL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: FORGOT_PASSWORD_TITLE,
};

const ForgotPasswordPage = async () => {
  // Render on every request so Next.js can stamp the CSP nonce on the page's scripts.
  await connection();

  return (
    <main>
      <h1>{FORGOT_PASSWORD_TITLE}</h1>
      <AuthForm
        action={resetPassword}
        fields={FORGOT_PASSWORD_FIELDS}
        submitLabel={SAVE_PASSWORD_LABEL}
      />
      <p>
        <Link href={LOGIN_PATH}>{HAVE_ACCOUNT_LABEL}</Link>
      </p>
    </main>
  );
};

export default ForgotPasswordPage;
