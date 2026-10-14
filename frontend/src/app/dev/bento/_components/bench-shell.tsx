import { cookies } from "next/headers";
import Link from "next/link";
import type * as React from "react";

import { AppProviders } from "@/components/providers/app-providers";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";

export const benchPages = [
  { href: "/dev", label: "All pages" },
  { href: "/dev/bento", label: "Dashboard" },
  { href: "/dev/bento/tickets", label: "Tickets" },
  { href: "/dev/bento/lists", label: "Lists" },
  { href: "/dev/bento/forms-and-buttons", label: "Forms and buttons" },
  { href: "/dev/bento/states", label: "States" },
  { href: "/dev/shell", label: "App shell" },
] as const;

export type BenchHref = (typeof benchPages)[number]["href"];

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 border-t border-line pt-6">
        <h2 id={id} className="font-display text-h2">
          {title}
        </h2>
        {description !== undefined && (
          <p className="max-w-[60ch] text-base text-ink-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export async function BenchShell({
  current,
  title,
  children,
}: {
  current: BenchHref;
  title: string;
  children: React.ReactNode;
}) {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-8 sm:px-5 md:px-6 lg:px-8 xl:px-10">
      <header className="flex flex-col gap-4 border-b border-line pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-base text-ink-muted">CargoShare design bench</p>
          <ThemeSwitcher initialTheme={theme} />
        </div>
        <nav aria-label="Bench pages">
          {/* Phones: one swipeable row instead of three wrapped rows. */}
          <ul className="-mx-4 flex [scrollbar-width:none] gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:gap-y-2 sm:overflow-visible sm:px-0">
            {benchPages.map((page) => (
              <li key={page.href} className="shrink-0">
                <Link
                  href={page.href}
                  aria-current={page.href === current ? "page" : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-base whitespace-nowrap text-ink-muted hover:text-ink aria-[current=page]:bg-ink aria-[current=page]:text-bg pointer-coarse:min-h-12"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex flex-col gap-12">
        <h1 className="font-display text-h1">{title}</h1>
        <AppProviders>{children}</AppProviders>
      </main>
    </div>
  );
}
