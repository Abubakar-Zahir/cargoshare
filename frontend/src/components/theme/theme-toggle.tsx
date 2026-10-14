"use client";

import { cn } from "cn";
import { MoonIcon, SunIcon } from "lucide-react";
import type * as React from "react";

import { applyTheme, type ResolvedTheme } from "@/lib/theme";

import { saveThemeAction } from "./actions";
import { useThemeSync } from "./use-theme";

const buttonClass =
  "size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-surface-2 hover:text-ink active:bg-surface-2";

/**
 * One tap between light and dark. Both buttons are in the HTML and CSS shows
 * the one that fits what is on screen, so the icon and label are right on the
 * first paint, also when the device decides ("Same as device"). Works without
 * JavaScript through a form post; with JavaScript it switches instantly.
 */
export function ThemeToggle({ className }: { className?: string }) {
  useThemeSync();

  function choose(theme: ResolvedTheme) {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      applyTheme(theme);
    };
  }

  return (
    <form
      action={saveThemeAction}
      data-slot="theme-toggle"
      className={cn("inline-flex", className)}
    >
      <button
        type="submit"
        name="theme"
        value="dark"
        aria-label="Switch to dark theme"
        title="Switch to dark theme"
        onClick={choose("dark")}
        className={cn("inline-flex dark:hidden", buttonClass)}
      >
        <MoonIcon aria-hidden className="size-5" />
      </button>
      <button
        type="submit"
        name="theme"
        value="light"
        aria-label="Switch to light theme"
        title="Switch to light theme"
        onClick={choose("light")}
        className={cn("hidden dark:inline-flex", buttonClass)}
      >
        <SunIcon aria-hidden className="size-5" />
      </button>
    </form>
  );
}
