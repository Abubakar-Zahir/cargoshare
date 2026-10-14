"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-control! border-line! bg-surface! text-ink! shadow-lift!",
          description: "text-ink-muted!",
          actionButton: "bg-ink! text-bg!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
