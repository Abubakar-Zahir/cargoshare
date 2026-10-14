"use client";

import "./globals.css";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-4 py-16">
          <h1 className="text-4xl font-semibold">
            CargoShare couldn&apos;t load.
          </h1>
          <p className="text-lg text-ink-muted">
            Something went wrong on our side. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="min-h-12 rounded-control bg-accent px-5 text-accent-ink"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
