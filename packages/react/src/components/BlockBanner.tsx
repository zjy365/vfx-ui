"use client";

import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockActionButton, blockAccentStyle, type BlockAction } from "./blockShared";

export interface BlockBannerProps {
  /** The announcement copy. */
  message?: ReactNode;
  /** Optional inline action (a real link or button). */
  action?: BlockAction | null;
  /** Show the dismiss control (default true). */
  dismissible?: boolean;
  /** Accessible label for the dismiss control. */
  dismissLabel?: string;
  /** Stick to the top of the viewport while the page scrolls (default true). */
  sticky?: boolean;
  /** Accessible name for the banner region. */
  regionLabel?: string;
  /** Called after the banner is dismissed. */
  onDismiss?: () => void;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-banner{z-index:60;border-bottom:1px solid color-mix(in srgb,var(--vb-accent) 30%,var(--vb-border));background:color-mix(in srgb,var(--vb-accent) 10%,var(--vb-bg))}
.vfx-banner[data-sticky="true"]{position:sticky;top:0}
.vfx-banner-bar{display:flex;align-items:center;gap:14px;min-height:52px;padding-block:8px}
.vfx-banner-dot{width:7px;height:7px;flex:none;border-radius:50%;background:var(--vb-accent);animation:vfx-banner-pulse 2.4s ease-in-out infinite}
@keyframes vfx-banner-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--vb-accent) 40%,transparent)}50%{box-shadow:0 0 0 6px color-mix(in srgb,var(--vb-accent) 40%,transparent)}}
.vfx-banner-message{min-width:0;font-size:13px;letter-spacing:-.01em;line-height:1.5;color:var(--vb-fg)}
.vfx-banner-action{flex:none}
.vfx-banner .vfx-block-btn{min-height:32px;padding:7px 12px;font-size:11px}
.vfx-banner-close{display:grid;place-items:center;width:34px;height:34px;flex:none;margin-left:auto;border:1px solid var(--vb-border);border-radius:6px;background:transparent;color:var(--vb-muted);cursor:pointer;transition:color 160ms,border-color 160ms}
.vfx-banner-close:hover{color:var(--vb-fg);border-color:var(--vb-faint)}
.vfx-banner-close svg{width:12px;height:12px}
@container(max-width:640px){.vfx-banner-bar{flex-wrap:wrap;gap:10px;padding-block:12px}.vfx-banner-action{margin-left:12px}.vfx-banner-close{margin-left:auto}}
`;

/**
 * Announcement banner: a slim, accent-tinted strip for one important message,
 * with an optional action. Dismissible for real — the control is a labeled
 * button, Escape works while focus is inside, and onDismiss lets a host
 * persist the choice. Sticky to the top of the viewport by default; set
 * sticky={false} to keep it inline. The default copy is fictional demo
 * content marked inline.
 */
export function BlockBanner({
  message = "Orbit 2.4 is rolling out this week — release replays for every plan. (demo)",
  action = { label: "Read the changelog", href: "#changelog" },
  dismissible = true,
  dismissLabel = "Dismiss announcement",
  sticky = true,
  regionLabel = "Announcement",
  onDismiss,
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockBannerProps) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    onDismiss?.();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (dismissible && event.key === "Escape") dismiss();
  };

  return (
    <aside
      className={`vfx-block vfx-banner${className ? ` ${className}` : ""}`}
      data-sticky={sticky}
      data-scheme={scheme}
      aria-label={regionLabel}
      onKeyDown={onKeyDown}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <div className="vfx-banner-bar">
            <span className="vfx-banner-dot" aria-hidden="true" />
            <p className="vfx-banner-message">
              {message}
              {action ? (
                <span className="vfx-banner-action">
                  {" "}
                  <BlockActionButton action={action} variant="ghost" />
                </span>
              ) : null}
            </p>
            {dismissible ? (
              <button type="button" className="vfx-banner-close" onClick={dismiss} aria-label={dismissLabel}>
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}
