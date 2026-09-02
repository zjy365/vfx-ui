export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "vfx-ui-theme";

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function resolveScheme(mode: ThemeMode, prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches): "light" | "dark" {
  if (mode === "system") return prefersDark ? "dark" : "light";
  return mode;
}

export function applyAppearance(
  mode: ThemeMode,
  prefersDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false,
) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.dataset.theme = mode;
  root.dataset.scheme = resolveScheme(mode, prefersDark);
}

export function readStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(saved) ? saved : "dark";
  } catch {
    return "dark";
  }
}
