import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import AuthForm from "@/components/auth/auth-form";
import { signUp } from "@/lib/auth/actions";
import {
  HAVE_ACCOUNT_LABEL,
  LOGIN_PATH,
  SIGN_UP_LABEL,
  SIGNUP_FIELDS,
  SIGNUP_TITLE,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: SIGNUP_TITLE,
};

const SignupPage = async () => {
  // Render on every request so Next.js can stamp the CSP nonce on the page's scripts.
  await connection();

  return (
    <main>
      <h1>{SIGNUP_TITLE}</h1>
      <AuthForm action={signUp} fields={SIGNUP_FIELDS} submitLabel={SIGN_UP_LABEL} />
      <p>
        <Link href={LOGIN_PATH}>{HAVE_ACCOUNT_LABEL}</Link>
      </p>
    </main>
  );
};

export default SignupPage;
