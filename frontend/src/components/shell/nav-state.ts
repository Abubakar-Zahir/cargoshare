export const NAV_COOKIE = "nav";

export type NavMode = "full" | "rail";

export function parseNavMode(value: string | undefined): NavMode {
  return value === "rail" ? "rail" : "full";
}

export function navCookie(mode: NavMode, secure: boolean): string {
  const parts = [
    `${NAV_COOKIE}=${mode}`,
    "path=/",
    "max-age=31536000",
    "samesite=lax",
  ];
  if (secure) {
    parts.push("secure");
  }
  return parts.join("; ");
}

export function saveNavMode(mode: NavMode): void {
  document.cookie = navCookie(mode, window.location.protocol === "https:");
}
