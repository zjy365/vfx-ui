"use client";
import { useState } from "react";
export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
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
    <button className="copy-button" onClick={copy} type="button">
      <span aria-live="polite">{state || label}</span>
    </button>
  );
}
