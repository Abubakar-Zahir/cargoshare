import { cookies } from "next/headers";
import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";

export async function SiteFooter() {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-sm flex-col gap-2">
          <p className="font-display text-2xl">CargoShare</p>
          <p className="text-base text-ink-muted">
            Small things, sent with people already making the trip. Across
            Pakistan.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              <li>
                <Link
                  prefetch={false}
                  href="/#how-it-works"
                  className="inline-flex min-h-11 items-center text-ink-muted hover:text-ink"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  href="/login"
                  className="inline-flex min-h-11 items-center text-ink-muted hover:text-ink"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  href="/signup"
                  className="inline-flex min-h-11 items-center text-ink-muted hover:text-ink"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </nav>
          <ThemeSwitcher initialTheme={theme} />
          <p className="text-sm text-ink-muted">© 2026 CargoShare</p>
        </div>
      </div>
    </footer>
  );
}
