import type { Metadata } from "next";
import { connection } from "next/server";

import AuthForm from "@/components/auth/auth-form";
import { resetPassword } from "@/lib/auth/actions";
import { RESET_PASSWORD_FIELDS, RESET_PASSWORD_TITLE, SAVE_PASSWORD_LABEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: RESET_PASSWORD_TITLE,
};

const ResetPasswordPage = async () => {
  // Render on every request so Next.js can stamp the CSP nonce on the page's scripts.
  await connection();

  return (
    <main>
      <h1>{RESET_PASSWORD_TITLE}</h1>
      <AuthForm
        action={resetPassword}
        fields={RESET_PASSWORD_FIELDS}
        submitLabel={SAVE_PASSWORD_LABEL}
      />
    </main>
  );
};

export default ResetPasswordPage;
