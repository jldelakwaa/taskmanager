"use client";

import { useSyncExternalStore, type ReactNode } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "coliconstruct-theme";
const THEME_EVENT = "coliconstruct-theme-change";
let fallbackTheme: Theme = "light";

function subscribe(callback: () => void) {
  function storageChanged(event: StorageEvent) {
    if (event.key === THEME_KEY || event.key === null) callback();
  }
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", storageChanged);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", storageChanged);
  };
}

function readTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return fallbackTheme;
  }
}

function serverTheme(): Theme {
  return "light";
}

export function useMarketingTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);
  function setTheme(next: Theme) {
    fallbackTheme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* Keep the preference for this page when browser storage is blocked. */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }
  return { theme, setTheme };
}

export function MarketingTheme({ children }: { children: ReactNode }) {
  const { theme } = useMarketingTheme();
  // The server and hydration snapshot agree; React applies saved preferences afterward.
  return (
    <div className="marketing-page" data-theme={theme}>
      {children}
    </div>
  );
}
