"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export default function ErrorBoundary({ reset }: { reset: () => void }) {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  return (
    <main
      id="main"
      role="alert"
      className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-4 py-16 sm:px-6"
    >
      <h1 className="font-display text-h1 text-balance">
        {online ? "Something went wrong on our side." : "You're offline."}
      </h1>
      <p className="max-w-[52ch] text-lg text-ink-muted">
        {online
          ? "Try again. If it keeps happening, wait a few minutes and come back."
          : "Check your internet connection. When you're back online, try again."}
      </p>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
