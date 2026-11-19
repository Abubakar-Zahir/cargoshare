import type { FieldProps } from "@/lib/types";

const Field = ({ id, label, hint, hintId, children }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {hint && (
      <p id={hintId} className="text-sm text-ink-muted">
        {hint}
      </p>
    )}
  </div>
);

export default Field;
