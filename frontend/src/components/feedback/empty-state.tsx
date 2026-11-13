import type { ReactNode } from "react";

const EmptyState = ({ title, children }: Readonly<{ title: string; children: ReactNode }>) => (
  <div className="py-6">
    <p className="font-display text-2xl font-medium">{title}</p>
    <div className="mt-3 max-w-lg text-ink-muted">{children}</div>
  </div>
);
export default EmptyState;
