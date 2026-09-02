import { MoonIcon, SunIcon, SystemIcon } from "./icons";
import type { ThemeMode } from "../theme";

type ThemeButtonsProps = {
  compact?: boolean;
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

export function ThemeButtons({ compact = false, mode, onChange }: ThemeButtonsProps) {
  return (
    <div className={`theme-buttons${compact ? " compact" : ""}`} role="group" aria-label="Appearance">
      <button
        className={`theme-button${mode === "light" ? " active" : ""}`}
        type="button"
        aria-label="Use light mode"
        aria-pressed={mode === "light"}
        title="Light"
        onClick={() => onChange("light")}
      >
        <SunIcon />
        <span>Light</span>
      </button>
      <button
        className={`theme-button${mode === "dark" ? " active" : ""}`}
        type="button"
        aria-label="Use dark mode"
        aria-pressed={mode === "dark"}
        title="Dark"
        onClick={() => onChange("dark")}
      >
        <MoonIcon />
        <span>Dark</span>
      </button>
      <button
        className={`theme-button${mode === "system" ? " active" : ""}`}
        type="button"
        aria-label="Follow system appearance"
        aria-pressed={mode === "system"}
        title="System"
        onClick={() => onChange("system")}
      >
        <SystemIcon />
        <span>System</span>
      </button>
    </div>
  );
}

export type { ThemeMode };
