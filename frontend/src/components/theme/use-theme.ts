"use client";

import { useEffect, useSyncExternalStore } from "react";

import { readTheme, subscribeTheme, syncTheme, type Theme } from "@/lib/theme";

/** The saved choice, shared by every theme control on the page. */
export function useTheme(initialTheme: Theme): Theme {
  return useSyncExternalStore(subscribeTheme, readTheme, () => initialTheme);
}

/** Keeps the page on the saved choice after the back button or a tab switch. */
export function useThemeSync(): void {
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") {
        syncTheme();
      }
    }
    window.addEventListener("pageshow", syncTheme);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pageshow", syncTheme);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
