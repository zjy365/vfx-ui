"use client";

import { useId, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export interface BlockNewsletterProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Accessible label for the email input. */
  emailLabel?: string;
  placeholder?: string;
  submitLabel?: string;
  /** Message shown when the address fails validation. */
  invalidEmailMessage?: ReactNode;
  /** Heading of the confirmation panel after a successful submission. */
  successTitle?: ReactNode;
  successNote?: ReactNode;
  /** Label for the small reset link after subscribing. */
  resetLabel?: string;
  /**
   * Your subscribe handler. When omitted the block runs in demo mode: the
   * address is validated and confirmed locally, and nothing is sent anywhere.
   */
  onSubscribe?: (email: string) => void | Promise<void>;
  /** Honest labeling for demo mode; set to null once a real handler is wired. */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-newsletter{padding-block:clamp(56px,8cqw,104px)}
.vfx-newsletter-stage{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,6cqw,88px);align-items:center;padding:clamp(32px,5cqw,56px);background:var(--vb-card);border:1px solid var(--vb-border);border-radius:var(--vb-radius)}
.vfx-newsletter .vfx-block-title{font-size:clamp(28px,3.6cqw,44px)}
.vfx-newsletter-form{display:flex;flex-direction:column;gap:12px}
.vfx-newsletter-row{display:flex;gap:12px}
.vfx-newsletter-input{flex:1;min-width:0;min-height:48px;padding:12px 16px;border:1px solid var(--vb-border);border-radius:7px;background:var(--vb-bg);color:var(--vb-fg);font:400 14px/1.4 var(--vb-font);transition:border-color 160ms}
.vfx-newsletter-input::placeholder{color:var(--vb-faint)}
.vfx-newsletter-input:hover{border-color:var(--vb-faint)}
.vfx-newsletter-input[aria-invalid="true"]{border-color:#e58f7a}
.vfx-newsletter .vfx-block-btn{min-height:48px;white-space:nowrap}
.vfx-newsletter-error{min-height:18px;font-size:11px;line-height:1.6;color:#e58f7a}
.vfx-newsletter-done{display:flex;flex-direction:column;gap:14px;padding:8px 0}
.vfx-newsletter-done h3{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:500;letter-spacing:-.02em}
.vfx-newsletter-done-badge{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:50%;background:var(--vb-accent);color:var(--vb-accent-ink)}
.vfx-newsletter-done-badge svg{width:12px;height:12px}
.vfx-newsletter-done p{font-size:13px;line-height:1.7;color:var(--vb-muted)}
.vfx-newsletter-done-email{color:var(--vb-fg);font-weight:500}
.vfx-newsletter-reset{align-self:flex-start;border:0;background:none;padding:0;font:500 11px var(--vb-font);color:var(--vb-muted);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.vfx-newsletter-reset:hover{color:var(--vb-fg)}
.vfx-newsletter-note{margin-top:20px}
@container(max-width:760px){.vfx-newsletter-stage{grid-template-columns:1fr;gap:28px}.vfx-newsletter-row{flex-direction:column}.vfx-newsletter .vfx-block-btn{width:100%}}
`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup: a working form, not a mockup. The address is validated
 * client-side with inline, announced errors (aria-invalid + role="alert"),
 * and a successful submission swaps to a confirmation panel (role="status").
 * Wire your own handler via onSubscribe; without one it runs in demo mode —
 * validated and confirmed locally, never sent — and says so on screen.
 */
export function BlockNewsletter({
  eyebrow = "Newsletter",
  title = "One careful email a month.",
  description = "Release notes, a few hard-won lessons, and nothing else. Unsubscribe any time.",
  emailLabel = "Email address",
  placeholder = "you@company.com",
  submitLabel = "Subscribe",
  invalidEmailMessage = "That doesn’t look like an email address — check the spelling and try again.",
  successTitle = "You’re on the list.",
  successNote = "The next issue lands in your inbox at the start of next month.",
  resetLabel = "Use a different address",
  onSubscribe,
  demoNote = "Demo mode: submissions are validated in the browser and never sent anywhere until you wire up onSubscribe.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockNewsletterProps) {
  const instanceId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError(true);
      return;
    }
    setError(false);
    setSubmitted(value);
    setDone(true);
    onSubscribe?.(value);
  };

  const errorId = `${instanceId}-error`;

  return (
    <section
      className={`vfx-block vfx-newsletter${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <div className="vfx-newsletter-stage">
            <header className="vfx-block-head">
              {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
              {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
              {description ? <p className="vfx-block-lede">{description}</p> : null}
            </header>
            {done ? (
              <div className="vfx-newsletter-done" role="status">
                <h3>
                  <span className="vfx-newsletter-done-badge" aria-hidden="true">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 6.5 4.5 9.5 10.5 2.5" />
                    </svg>
                  </span>
                  {successTitle}
                </h3>
                <p>
                  Confirmation sent to <span className="vfx-newsletter-done-email">{submitted}</span>. {successNote}
                </p>
                <button type="button" className="vfx-newsletter-reset" onClick={() => { setDone(false); setEmail(""); }}>
                  {resetLabel}
                </button>
              </div>
            ) : (
              <form className="vfx-newsletter-form" onSubmit={onSubmit} noValidate>
                <label className="vfx-block-subtle" htmlFor={`${instanceId}-email`} style={{ display: "flex" }}>
                  {emailLabel}
                </label>
                <div className="vfx-newsletter-row">
                  <input
                    id={`${instanceId}-email`}
                    className="vfx-newsletter-input"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={placeholder}
                    value={email}
                    required
                    aria-invalid={error}
                    aria-describedby={error ? errorId : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError(false);
                    }}
                  />
                  <button type="submit" className="vfx-block-btn vfx-block-btn--primary">{submitLabel}</button>
                </div>
                <p className="vfx-newsletter-error" id={errorId} role="alert">
                  {error ? invalidEmailMessage : ""}
                </p>
              </form>
            )}
            {demoNote ? <p className="vfx-newsletter-note vfx-block-subtle" style={{ gridColumn: "1 / -1", margin: 0 }}>{demoNote}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}
