"use client";
import { useState } from "react";
export function CopyButton({
  value,
  label = "Copy",
  event = "copy_install_click",
  component,
}: {
  value: string;
  label?: string;
  event?: "copy_install_click" | "copy_code_click";
  component?: string;
}) {
  const [state, setState] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("Copied");
      setTimeout(() => setState(""), 2000);
    } catch {
      setState("Select and copy the code below.");
    }
  }
  return (
    <button
      className="copy-button"
      onClick={copy}
      type="button"
      data-rybbit-event={event}
      data-rybbit-prop-component={component}
    >
      <span aria-live="polite">{state || label}</span>
    </button>
  );
}
