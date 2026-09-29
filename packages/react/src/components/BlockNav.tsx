"use client";

import { useId, useEffect, useState, type CSSProperties } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type NavLink = { label: string; href: string };
export type NavAction = { label: string; href: string };

export interface BlockNavProps {
  /** Brand name shown in the bar; a monogram tile is generated from it. */
  brand?: string;
  /** Destination for the brand link. */
  brandHref?: string;
  links?: readonly NavLink[];
  /** Primary action on the right (a real link, keyboard reachable). */
  action?: NavAction | null;
  /** Optional secondary quiet link next to the action. */
  secondaryAction?: NavAction | null;
  /** Sticky bars overlay page content; off by default so the block stays composable. */
  sticky?: boolean;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
.vfx-nav{z-index:40;border-bottom:1px solid var(--vb-border)}
.vfx-nav[data-sticky="true"]{position:sticky;top:0}
.vfx-nav[data-stuck="true"]{box-shadow:0 4px 20px #00000010}
.vfx-nav-bar{display:flex;align-items:center;gap:24px;min-height:80px}
.vfx-nav-brand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600;letter-spacing:-.04em;white-space:nowrap}
.vfx-nav-mark{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--vb-border);border-radius:50%;font:500 15px Georgia,serif;color:var(--vb-fg);box-shadow:inset 0 0 0 4px var(--vb-bg),inset 0 0 0 5px var(--vb-border)}
.vfx-nav-links{display:flex;align-items:center;gap:28px;margin:auto}
.vfx-nav-link{font-size:12px;color:var(--vb-muted);padding:10px 0;transition:color 160ms}
.vfx-nav-link:hover{color:var(--vb-fg)}
.vfx-nav-actions{display:flex;align-items:center;gap:22px;margin-left:auto}
.vfx-nav-quiet{font-size:12px;color:var(--vb-muted)}
.vfx-nav-burger{display:none;margin-left:auto;width:42px;height:42px;place-items:center;border:1px solid var(--vb-border);background:var(--vb-card);border-radius:6px;color:var(--vb-fg);cursor:pointer}
.vfx-nav-burger svg{width:18px;height:18px}
.vfx-nav-sheet{display:none;padding:8px 0 24px;border-top:1px solid var(--vb-border)}
.vfx-nav-sheet nav{display:grid}.vfx-nav-sheet .vfx-nav-link{padding:14px 0;border-bottom:1px solid var(--vb-border);font-size:15px}
.vfx-nav-sheet-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}
@container(max-width:860px){.vfx-nav-links,.vfx-nav-actions{display:none}.vfx-nav-burger{display:grid}.vfx-nav-bar{min-height:72px}.vfx-nav-sheet{display:block}}
`;

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <path d="M4 4l10 10M14 4L4 14" />
      ) : (
        <path d="M2 5h14M2 9h14M2 13h14" />
      )}
    </svg>
  );
}

/**
 * Complete navigation bar: brand, desktop links, actions, and an accessible
 * mobile sheet. Pure DOM/CSS — no WebGPU, no animation library. The sheet is
 * real focusable markup (links stay in the tab order when open), closes on
 * Escape and on link activation, and the sticky variant only adds a scrim
 * border once the page scrolls.
 */
export function BlockNav({
  brand = "Northwind",
  brandHref = "#top",
  links = [
    { label: "Product", href: "#product" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  action = { label: "Get started", href: "#get-started" },
  secondaryAction = { label: "Sign in", href: "#sign-in" },
  sticky = false,
  scheme = "dark",
  accent,
  className,
  style,
}: BlockNavProps) {
  const instanceId = useId();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!sticky) return undefined;
    const onScroll = () => setStuck(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const monogram = brand.trim().charAt(0).toUpperCase() || "•";

  return (
    <header
      className={`vfx-block vfx-nav${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      data-sticky={sticky}
      data-stuck={stuck}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        <div className="vfx-nav-bar">
          <a className="vfx-nav-brand" href={brandHref} aria-label={`${brand} home`}>
            <span className="vfx-nav-mark" aria-hidden="true">{monogram}</span>
            {brand}
          </a>
          <nav className="vfx-nav-links" aria-label="Primary">
            {links.map((link) => (
              <a className="vfx-nav-link" href={link.href} key={`${link.label}-${link.href}`}>{link.label}</a>
            ))}
          </nav>
          <div className="vfx-nav-actions">
            {secondaryAction ? <a className="vfx-nav-quiet" href={secondaryAction.href}>{secondaryAction.label}</a> : null}
            {action ? <a className="vfx-block-btn vfx-block-btn--primary vfx-block-btn--sm" href={action.href}>{action.label}</a> : null}
          </div>
          <button
            type="button"
            className="vfx-nav-burger"
            aria-expanded={open}
            aria-controls={`${instanceId}-sheet`}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
          >
            <BurgerIcon open={open} />
          </button>
        </div>
        {open ? (
          <div className="vfx-nav-sheet" id={`${instanceId}-sheet`}>
            <nav aria-label="Mobile">
              {links.map((link) => (
                <a className="vfx-nav-link" href={link.href} key={`${link.label}-${link.href}`} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>
            {action || secondaryAction ? (
              <div className="vfx-nav-sheet-actions">
                {secondaryAction ? (
                  <a className="vfx-block-btn vfx-block-btn--ghost vfx-block-btn--sm" href={secondaryAction.href} onClick={() => setOpen(false)}>
                    {secondaryAction.label}
                  </a>
                ) : null}
                {action ? (
                  <a className="vfx-block-btn vfx-block-btn--primary vfx-block-btn--sm" href={action.href} onClick={() => setOpen(false)}>
                    {action.label}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
