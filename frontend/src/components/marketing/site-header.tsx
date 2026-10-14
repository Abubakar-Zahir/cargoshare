import Link from "next/link";

import { SkipLink } from "@/components/shell/skip-link";
import { Wordmark } from "@/components/shell/wordmark";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <SkipLink />
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2 px-4 sm:px-6">
        <Wordmark href="/" className="text-xl sm:text-2xl" />
        <nav aria-label="Site" className="flex items-center gap-0.5 sm:gap-2">
          <Link
            prefetch={false}
            href="/#how-it-works"
            className="hidden min-h-11 items-center px-3 text-base text-ink-muted hover:text-ink sm:inline-flex"
          >
            How it works
          </Link>
          <Link
            prefetch={false}
            href="/login"
            className="inline-flex min-h-11 items-center px-2.5 text-base whitespace-nowrap text-ink hover:underline hover:underline-offset-4 sm:px-3"
          >
            Log in
          </Link>
          {/* Under 360px the hero's own buttons lead to sign up. */}
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="max-[359px]:hidden"
          >
            <Link prefetch={false} href="/signup">
              Sign up
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
