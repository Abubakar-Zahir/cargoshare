"use client";

import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth/actions";

type AuthField = Readonly<{
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
  hint?: string;
  defaultChecked?: boolean;
}>;

type AuthFormProps = Readonly<{
  action: (previous: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  fields: readonly AuthField[];
  submitLabel: string;
  hiddenValues?: Readonly<Record<string, string>>;
}>;

const INITIAL_STATE: AuthFormState = { error: null, success: null, values: null };

const AuthForm = ({ action, fields, submitLabel, hiddenValues = {} }: AuthFormProps) => {
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  if (state.success) {
    return <p role="status">{state.success}</p>;
  }

  return (
    <form action={formAction}>
      {Object.entries(hiddenValues).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {fields.map(({ name, label, type, autoComplete, hint, defaultChecked }) => {
        const hintId = `${name}-hint`;
        const previous = state.values?.[name];
        const startingValue =
          type === "checkbox"
            ? { defaultChecked: state.values ? previous !== undefined : defaultChecked }
            : { defaultValue: previous ?? "", required: true };

        return (
          <div key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              autoComplete={autoComplete}
              aria-describedby={hint ? hintId : undefined}
              {...startingValue}
            />
            {hint && <p id={hintId}>{hint}</p>}
          </div>
        );
      })}
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;
