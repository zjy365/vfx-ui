"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type GalleryItem = {
  title: ReactNode;
  /** Supporting line shown under the title. */
  caption?: ReactNode;
  /** Your image, video or diagram node. Defaults to a generated CSS artwork. */
  media?: ReactNode;
  /** Accessible name for the lightbox dialog (defaults to the title text). */
  alt?: string;
  /** Make the tile span two rows in the grid. */
  tall?: boolean;
  /** Used as a plain link when lightbox is disabled. */
  href?: string;
};

export interface BlockGalleryProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  items?: readonly GalleryItem[];
  /** Open a fullscreen viewer on tile activation (default true). */
  lightbox?: boolean;
  /** Text for the lightbox close control. */
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in real work.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-gallery{padding-block:clamp(64px,9cqw,112px)}
.vfx-gallery .vfx-block-head{margin-bottom:52px}
.vfx-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:190px;grid-auto-flow:dense;gap:14px}
.vfx-gallery-tile{display:flex;flex-direction:column;gap:12px;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.vfx-gallery-tile--tall{grid-row:span 2}
.vfx-gallery-thumb{position:relative;flex:1;overflow:hidden;border:1px solid var(--vb-border);border-radius:10px;background:var(--vb-card);transition:transform 200ms ease,box-shadow 200ms ease,border-color 200ms ease}
.vfx-gallery-tile:hover .vfx-gallery-thumb,.vfx-gallery-tile:focus-visible .vfx-gallery-thumb{transform:translateY(-4px);border-color:color-mix(in srgb,var(--vb-accent) 45%,var(--vb-border));box-shadow:0 14px 34px #00000026}
.vfx-gallery-thumb>*{position:absolute;inset:0}
.vfx-gallery-thumb img,.vfx-gallery-thumb video{width:100%;height:100%;object-fit:cover}
.vfx-gallery-meta{display:flex;align-items:baseline;gap:10px}
.vfx-gallery-name{font-size:12px;font-weight:500;letter-spacing:-.01em}
.vfx-gallery-caption{font-size:10px;color:var(--vb-faint)}
.vfx-gallery-hint{position:absolute;left:12px;top:12px;right:auto;bottom:auto;z-index:2;display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--vb-border);border-radius:6px;background:color-mix(in srgb,var(--vb-bg) 78%,transparent);color:var(--vb-muted);opacity:0;transition:opacity 180ms}
.vfx-gallery-tile:hover .vfx-gallery-hint,.vfx-gallery-tile:focus-visible .vfx-gallery-hint{opacity:1}
.vfx-gallery-mark{margin-top:32px}
/* Generated artwork — asset-free demo pieces, one per variant. */
.vfx-gallery-art{background:var(--vb-card)}
.vfx-gallery-art::before{content:"";position:absolute;inset:0}
.vfx-gallery-art[data-v="0"]::before{background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--vb-accent) 55%,transparent) 0,transparent 34%),radial-gradient(circle at 72% 68%,color-mix(in srgb,var(--vb-fg) 18%,transparent) 0,transparent 40%),repeating-linear-gradient(0deg,transparent 0 23px,color-mix(in srgb,var(--vb-border) 70%,transparent) 23px 24px)}
.vfx-gallery-art[data-v="1"]::before{background:conic-gradient(from 210deg at 60% 40%,transparent 0turn,color-mix(in srgb,var(--vb-accent) 30%,transparent) .5turn,transparent .9turn),repeating-radial-gradient(circle at 60% 40%,transparent 0 18px,color-mix(in srgb,var(--vb-border) 60%,transparent) 18px 19px)}
.vfx-gallery-art[data-v="2"]::before{background:repeating-linear-gradient(115deg,color-mix(in srgb,var(--vb-fg) 10%,transparent) 0 26px,transparent 26px 60px),radial-gradient(circle at 78% 24%,color-mix(in srgb,var(--vb-accent) 60%,transparent) 0,transparent 26%)}
.vfx-gallery-art[data-v="3"]::before{background:radial-gradient(circle 42% at 50% 55%,transparent 0 58%,color-mix(in srgb,var(--vb-border) 90%,transparent) 58% 59.5%,transparent 59.5%),linear-gradient(0deg,color-mix(in srgb,var(--vb-fg) 7%,transparent),color-mix(in srgb,var(--vb-accent) 14%,transparent))}
/* Lightbox */
.vfx-gallery-overlay{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:24px;background:color-mix(in srgb,var(--vb-bg) 86%,transparent);backdrop-filter:blur(8px)}
.vfx-gallery-dialog{position:relative;display:flex;flex-direction:column;gap:16px;width:min(920px,100%);max-height:calc(100vh - 48px)}
.vfx-gallery-stage{position:relative;overflow:hidden;border:1px solid var(--vb-border);border-radius:12px;background:var(--vb-card);aspect-ratio:16/10;max-height:calc(100vh - 180px)}
.vfx-gallery-stage>*{position:absolute;inset:0}
.vfx-gallery-stage img,.vfx-gallery-stage video{width:100%;height:100%;object-fit:contain}
.vfx-gallery-dialog-meta{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.vfx-gallery-dialog-title{font-size:15px;font-weight:500}
.vfx-gallery-dialog-caption{font-size:11px;color:var(--vb-faint)}
.vfx-gallery-close{position:absolute;right:14px;top:14px;left:auto;bottom:auto;display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--vb-border);border-radius:8px;background:color-mix(in srgb,var(--vb-bg) 78%,transparent);color:var(--vb-fg);cursor:pointer}
.vfx-gallery-close svg{width:14px;height:14px}
.vfx-gallery-nav{display:flex;align-items:center;gap:12px}
.vfx-gallery-nav button{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--vb-border);border-radius:8px;background:var(--vb-card);color:var(--vb-fg);cursor:pointer;transition:border-color 160ms}
.vfx-gallery-nav button:hover{border-color:var(--vb-accent)}
.vfx-gallery-nav svg{width:14px;height:14px}
.vfx-gallery-count{font:10px ui-monospace,monospace;color:var(--vb-faint);letter-spacing:.08em}
@container(max-width:860px){.vfx-gallery-grid{grid-template-columns:1fr 1fr;grid-auto-rows:150px}}
@container(max-width:520px){.vfx-gallery-grid{grid-template-columns:1fr;grid-auto-rows:220px}}
@media(prefers-reduced-motion:reduce){.vfx-gallery-tile:hover .vfx-gallery-thumb,.vfx-gallery-tile:focus-visible .vfx-gallery-thumb{transform:none}}
`;

const DEMO_ITEMS: readonly GalleryItem[] = [
  { title: "Fieldnote — release graph redesign", caption: "Product work, 2026 (demo)" },
  { title: "Brightcar — canary console", caption: "Product work, 2026 (demo)" },
  { title: "loopwell — design system rebuild", caption: "Systems work, 2025 (demo)", tall: true },
  { title: "Arlo Health — audit trail", caption: "Product work, 2025 (demo)" },
  { title: "Stackform — onboarding flow", caption: "Product work, 2025 (demo)" },
  { title: "Quantelle — brand refresh", caption: "Brand work, 2024 (demo)", tall: true },
];

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "prev" ? <path d="M9 2 4 7l5 5" /> : <path d="M5 2l5 5-5 5" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" />
    </svg>
  );
}

/**
 * Work gallery: a responsive grid of tiles that lift on hover, with an
 * optional lightbox — a real dialog (focus moves in, Escape closes, arrow
 * keys navigate, Tab stays trapped, focus returns to the tile that opened
 * it). Media is fully replaceable; the default artwork is generated in CSS,
 * fictional, and visibly marked as demo content.
 */
export function BlockGallery({
  eyebrow = "Selected work",
  title = "Recent releases, up close.",
  description = "A few engagements from the last two years — open any piece for a better look.",
  items = [],
  lightbox = true,
  closeLabel = "Close viewer",
  previousLabel = "Previous piece",
  nextLabel = "Next piece",
  demoNote = "Artwork, titles and captions shown here are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockGalleryProps) {
  const demoItems = items.length ? items : DEMO_ITEMS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isOpen = openIndex != null && openIndex >= 0 && openIndex < demoItems.length;

  useEffect(() => {
    if (!isOpen) return undefined;
    closeRef.current?.focus();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      else if (event.key === "ArrowRight") setOpenIndex((i) => (i == null ? i : (i + 1) % demoItems.length));
      else if (event.key === "ArrowLeft") setOpenIndex((i) => (i == null ? i : (i - 1 + demoItems.length) % demoItems.length));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      lastTriggerRef.current?.focus();
      lastTriggerRef.current = null;
    };
  }, [isOpen, demoItems.length]);

  const openTile = (index: number) => {
    lastTriggerRef.current = triggerRefs.current[index] ?? null;
    setOpenIndex(index);
  };

  const trapTab = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusables = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea"),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (!focusables.length) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const activeItem = isOpen && openIndex != null ? demoItems[openIndex] : undefined;
  const dialogLabel =
    activeItem?.alt ?? (typeof activeItem?.title === "string" ? activeItem.title : "Gallery piece");

  return (
    <section
      className={`vfx-block vfx-gallery${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <>
            <header className="vfx-block-head">
              {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
              {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
              {description ? <p className="vfx-block-lede">{description}</p> : null}
            </header>
            <ul className="vfx-gallery-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {demoItems.map((item, index) => {
                const art = item.media ?? <span className="vfx-gallery-art" data-v={index % 4} aria-hidden="true" />;
                const meta = (
                  <span className="vfx-gallery-meta">
                    <span className="vfx-gallery-name">{item.title}</span>
                    {item.caption ? <span className="vfx-gallery-caption">{item.caption}</span> : null}
                  </span>
                );
                return (
                  <li className={`vfx-gallery-tile${item.tall ? " vfx-gallery-tile--tall" : ""}`} key={index}>
                    {lightbox ? (
                      <button
                        type="button"
                        className="vfx-gallery-tile"
                        onClick={() => openTile(index)}
                        ref={(el) => { triggerRefs.current[index] = el; }}
                        aria-label={typeof item.title === "string" ? `Open ${item.title}` : "Open gallery piece"}
                      >
                        <span className="vfx-gallery-thumb">
                          <span className="vfx-gallery-hint" aria-hidden="true">↗</span>
                          {art}
                        </span>
                        {meta}
                      </button>
                    ) : item.href ? (
                      <a className="vfx-gallery-tile" href={item.href}>
                        <span className="vfx-gallery-thumb">{art}</span>
                        {meta}
                      </a>
                    ) : (
                      <figure className="vfx-gallery-tile" style={{ margin: 0 }}>
                        <span className="vfx-gallery-thumb">{art}</span>
                        {meta}
                      </figure>
                    )}
                  </li>
                );
              })}
            </ul>
            {demoNote ? <p className="vfx-gallery-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
      {isOpen && activeItem && openIndex != null && typeof document !== "undefined"
        ? createPortal(
            <div className="vfx-gallery-overlay" onClick={() => setOpenIndex(null)}>
              <div
                className="vfx-gallery-dialog"
                role="dialog"
                aria-modal="true"
                aria-label={dialogLabel}
                ref={dialogRef}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={trapTab}
              >
                <div className="vfx-gallery-stage">
                  {activeItem.media ?? <span className="vfx-gallery-art" data-v={openIndex % 4} aria-hidden="true" />}
                  <button type="button" className="vfx-gallery-close" ref={closeRef} onClick={() => setOpenIndex(null)} aria-label={closeLabel}>
                    <CloseIcon />
                  </button>
                </div>
                <div className="vfx-gallery-dialog-meta">
                  <span className="vfx-gallery-dialog-title">{activeItem.title}</span>
                  {activeItem.caption ? <span className="vfx-gallery-dialog-caption">{activeItem.caption}</span> : null}
                </div>
                <div className="vfx-gallery-nav">
                  <button type="button" onClick={() => setOpenIndex((i) => (i == null ? i : (i - 1 + demoItems.length) % demoItems.length))} aria-label={previousLabel}>
                    <ArrowIcon direction="prev" />
                  </button>
                  <button type="button" onClick={() => setOpenIndex((i) => (i == null ? i : (i + 1) % demoItems.length))} aria-label={nextLabel}>
                    <ArrowIcon direction="next" />
                  </button>
                  <span className="vfx-gallery-count" aria-hidden="true">
                    {openIndex + 1} / {demoItems.length}
                  </span>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
