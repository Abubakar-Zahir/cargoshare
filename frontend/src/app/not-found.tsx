import type { Metadata } from "next";
import Link from "next/link";

import { Wordmark } from "@/components/shell/wordmark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-16 px-4 py-8 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <Wordmark href="/" />
        <ThemeToggle />
      </header>
      <main id="main" className="flex flex-col items-start gap-5">
        <p className="text-base text-ink-muted">Error 404</p>
        <h1 className="font-display text-display text-balance">
          We couldn&apos;t find that page.
        </h1>
        <p className="max-w-[52ch] text-lg text-ink-muted">
          The link may be old, or the page may have moved. Check the address, or
          start again from the home page.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go to the home page</Link>
        </Button>
      </main>
    </div>
  );
}
