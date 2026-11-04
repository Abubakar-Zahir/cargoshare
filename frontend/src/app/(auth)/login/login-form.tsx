"use client";

import { useActionState } from "react";

import { logIn, type LoginState } from "@/lib/auth/actions";

type LoginFormProps = Readonly<{
  emailLabel: string;
  passwordLabel: string;
  submitLabel: string;
}>;

const INITIAL_STATE: LoginState = { error: null, email: "" };

const LoginForm = ({ emailLabel, passwordLabel, submitLabel }: LoginFormProps) => {
  const [state, formAction, isPending] = useActionState(logIn, INITIAL_STATE);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">{emailLabel}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          required
        />
      </div>
      <div>
        <label htmlFor="password">{passwordLabel}</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {submitLabel}
      </button>
    </form>
  );
};

export default LoginForm;
