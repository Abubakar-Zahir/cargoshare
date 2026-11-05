import type { Metadata } from "next";
import Link from "next/link";

import AuthForm from "@/components/auth/auth-form";
import { logIn } from "@/lib/auth/actions";
import {
  FORGOT_PASSWORD_LABEL,
  FORGOT_PASSWORD_PATH,
  LOG_IN_LABEL,
  LOGIN_FIELDS,
  LOGIN_TITLE,
  NEXT_PARAM,
  NO_ACCOUNT_LABEL,
  SIGNUP_PATH,
} from "@/lib/constants";
import { safeNextPath } from "@/lib/validation/auth";

export const metadata: Metadata = {
  title: LOGIN_TITLE,
};

type LoginPageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;

  return (
    <main>
      <h1>{LOGIN_TITLE}</h1>
      <AuthForm
        action={logIn}
        fields={LOGIN_FIELDS}
        submitLabel={LOG_IN_LABEL}
        hiddenValues={{ [NEXT_PARAM]: safeNextPath(params[NEXT_PARAM]) }}
      />
      <p>
        <Link href={FORGOT_PASSWORD_PATH}>{FORGOT_PASSWORD_LABEL}</Link>
      </p>
      <p>
        <Link href={SIGNUP_PATH}>{NO_ACCOUNT_LABEL}</Link>
      </p>
    </main>
  );
};

export default LoginPage;
