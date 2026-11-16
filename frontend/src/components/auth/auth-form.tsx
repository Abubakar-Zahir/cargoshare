"use client";

import { useActionState } from "react";

import Button from "@/components/ui/button";
import Field from "@/components/ui/field";
import Input from "@/components/ui/input";

import type { AuthField, AuthFormState } from "@/lib/types";

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
    <form action={formAction} className="flex flex-col gap-5" aria-busy={isPending}>
      {Object.entries(hiddenValues).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {fields.map(({ name, label, type, autoComplete, hint, defaultChecked }) => {
        const previous = state.values?.[name];
        if (type === "checkbox") {
          return (
            <div key={name} className="flex min-h-11 items-center gap-3 pointer-coarse:min-h-12">
              <input
                id={name}
                name={name}
                type="checkbox"
                className="size-5 shrink-0 accent-accent"
                defaultChecked={state.values ? previous !== undefined : defaultChecked}
              />
              <label htmlFor={name}>{label}</label>
            </div>
          );
        }
        const hintId = `${name}-hint`;
        return (
          <Field key={name} id={name} label={label} hint={hint} hintId={hintId}>
            <Input
              id={name}
              name={name}
              type={type}
              autoComplete={autoComplete}
              aria-describedby={hint ? hintId : undefined}
              defaultValue={previous ?? ""}
              required
            />
          </Field>
        );
      })}
      {state.error && <p role="alert">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default AuthForm;
