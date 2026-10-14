export const THEME_COOKIE = "theme";

export const themes = ["light", "dark", "system"] as const;

export type Theme = (typeof themes)[number];

export type ResolvedTheme = "light" | "dark";

// Must match --bg in globals.css; the browser bar on phones uses these.
export const themeColors = {
  light: "#f9f5ed",
  dark: "#0f1319",
} as const satisfies Record<ResolvedTheme, string>;

const THEME_EVENT = "cargoshare:theme";

function isTheme(value: string): value is Theme {
  return (themes as readonly string[]).includes(value);
}

export function parseTheme(value: string | undefined): Theme {
  return value !== undefined && isTheme(value) ? value : "system";
}

export function themeAttribute(theme: Theme): ResolvedTheme | undefined {
  return theme === "system" ? undefined : theme;
}

export function themeCookie(theme: Theme, secure: boolean): string {
  const parts = [
    `${THEME_COOKIE}=${theme}`,
    "path=/",
    "max-age=31536000",
    "samesite=lax",
  ];
  if (secure) {
    parts.push("secure");
  }
  return parts.join("; ");
}

/** Browser bar colour for each colour scheme the device may report. */
export function themeColorFor(
  theme: Theme,
  scheme: ResolvedTheme,
): (typeof themeColors)[ResolvedTheme] {
  return themeColors[theme === "system" ? scheme : theme];
}

export function readTheme(): Theme {
  const match = /(?:^|;\s*)theme=([^;]*)/.exec(document.cookie);
  return parseTheme(match?.[1]);
}

export function subscribeTheme(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

/** Puts a theme on screen: the html attribute and the phone browser bar. */
function paintTheme(theme: Theme): void {
  const attribute = themeAttribute(theme);
  if (attribute === undefined) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = attribute;
  }
  for (const meta of document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]',
  )) {
    const scheme = meta.getAttribute("media")?.includes("dark")
      ? "dark"
      : "light";
    meta.content = themeColorFor(theme, scheme);
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function applyTheme(theme: Theme): void {
  document.cookie = themeCookie(theme, window.location.protocol === "https:");
  paintTheme(theme);
}

/**
 * Re-reads the saved choice. A page restored by the back button, or a tab that
 * sat in the background while another tab changed the theme, would otherwise
 * show the old one.
 */
export function syncTheme(): void {
  const theme = readTheme();
  if (themeAttribute(theme) !== document.documentElement.dataset.theme) {
    paintTheme(theme);
  }
}
