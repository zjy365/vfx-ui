"use client";
import { ThemeProvider as Provider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </Provider>
  );
}
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && theme === "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={dark ? "Use light theme" : "Use dark theme"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? (
        <Sun size={17} aria-hidden="true" />
      ) : (
        <Moon size={17} aria-hidden="true" />
      )}
    </button>
  );
}
