"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { applyTheme, type Theme } from "@/lib/theme";

import { saveThemeAction } from "./actions";
import { useTheme, useThemeSync } from "./use-theme";

const options = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const satisfies readonly {
  value: Theme;
  label: string;
  Icon: typeof SunIcon;
}[];

/** Light, dark or follow the device. Works without JavaScript through a form post. */
export function ThemeSwitcher({ initialTheme }: { initialTheme: Theme }) {
  const theme = useTheme(initialTheme);
  useThemeSync();

  return (
    <form
      action={saveThemeAction}
      role="group"
      aria-label="Theme"
      className="inline-flex w-fit rounded-full border border-line bg-surface p-1"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="submit"
          name="theme"
          value={value}
          aria-pressed={theme === value}
          onClick={(event) => {
            event.preventDefault();
            applyTheme(value);
          }}
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-ink-muted transition-colors duration-150 active:bg-surface-2 aria-pressed:bg-ink aria-pressed:text-bg"
        >
          <Icon aria-hidden className="size-4" />
          {label}
        </button>
      ))}
    </form>
  );
}
