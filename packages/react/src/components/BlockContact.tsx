"use client";

import { useId, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type ContactChannel = {
  /** Channel name, e.g. "Email". */
  label: string;
  /** The value people see and use, e.g. "hello@example.com". */
  value: ReactNode;
  /** Makes the value actionable (mailto:, tel:, a maps URL). */
  href?: string;
  /** Small line under the value, e.g. response-time expectations. */
  note?: ReactNode;
};

export type ContactField = {
  /** Form field name submitted to your handler. */
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  /** autocomplete hint, e.g. "name", "email", "organization". */
  autoComplete?: string;
};

export interface BlockContactProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  channels?: readonly ContactChannel[];
  fields?: readonly ContactField[];
  submitLabel?: string;
  /** Shown after a successful submission. */
  successNote?: ReactNode;
  /** Label for the small reset link after sending. */
  resetLabel?: string;
  /**
   * Your submit handler; receives the form values keyed by field name. When
   * omitted the form runs in demo mode — values never leave the page.
   */
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
  /** Honest labeling for demo mode; set to null once a real handler is wired. */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-contact{padding-block:clamp(64px,9cqw,112px)}
.vfx-contact-body{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,7fr);gap:clamp(32px,6cqw,88px);align-items:start}
.vfx-contact .vfx-block-head{position:sticky;top:100px;gap:24px}
.vfx-contact-channels{margin-top:32px;border-top:1px solid var(--vb-border);list-style:none;padding:0}
.vfx-contact-channel{padding:18px 0;border-bottom:1px solid var(--vb-border)}
.vfx-contact-channel dt{font:500 10px/1.4 ui-monospace,"SFMono-Regular",monospace;letter-spacing:.09em;text-transform:uppercase;color:var(--vb-faint)}
.vfx-contact-channel dd{margin:6px 0 0;font-size:15px;letter-spacing:-.01em}
.vfx-contact-channel dd a:hover{text-decoration:underline;text-underline-offset:4px}
.vfx-contact-channel-note{margin-top:5px;font-size:11px;line-height:1.6;color:var(--vb-faint)}
.vfx-contact-form{display:grid;gap:18px;padding:clamp(24px,4cqw,36px);background:var(--vb-card);border:1px solid var(--vb-border);border-radius:var(--vb-radius)}
.vfx-contact-field{display:grid;gap:8px}
.vfx-contact-field label{font-size:11px;font-weight:500;color:var(--vb-muted)}
.vfx-contact-input{min-height:46px;padding:11px 14px;border:1px solid var(--vb-border);border-radius:7px;background:var(--vb-bg);color:var(--vb-fg);font:400 14px/1.5 var(--vb-font);transition:border-color 160ms}
.vfx-contact-input::placeholder{color:var(--vb-faint)}
.vfx-contact-input:hover{border-color:var(--vb-faint)}
textarea.vfx-contact-input{min-height:120px;resize:vertical}
.vfx-contact-form .vfx-block-btn{justify-self:start}
.vfx-contact-done{display:flex;flex-direction:column;gap:12px;padding:clamp(24px,4cqw,36px);background:var(--vb-card);border:1px solid var(--vb-border);border-radius:var(--vb-radius)}
.vfx-contact-done h3{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:500}
.vfx-contact-done-badge{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:50%;background:var(--vb-accent);color:var(--vb-accent-ink)}
.vfx-contact-done-badge svg{width:12px;height:12px}
.vfx-contact-done p{font-size:13px;line-height:1.7;color:var(--vb-muted)}
.vfx-contact-reset{align-self:flex-start;border:0;background:none;padding:0;font:500 11px var(--vb-font);color:var(--vb-muted);cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.vfx-contact-reset:hover{color:var(--vb-fg)}
.vfx-contact-note{margin-top:20px}
@container(max-width:760px){.vfx-contact-body{grid-template-columns:1fr;gap:36px}.vfx-contact .vfx-block-head{position:static}}
`;

const DEMO_CHANNELS: readonly ContactChannel[] = [
  { label: "Email", value: "hello@orbit.example", href: "mailto:hello@orbit.example", note: "Replies within one business day." },
  { label: "Phone", value: "+1 (555) 010-7400", href: "tel:+15550107400", note: "Weekdays, 9:00–17:00 CET." },
  { label: "Office", value: "210 Harbor Lane, Suite 4", note: "Visits by appointment." },
  { label: "Response time", value: "Usually under a day", note: "Faster if you mention deploy tooling." },
];

const DEMO_FIELDS: readonly ContactField[] = [
  { name: "name", label: "Name", type: "text", required: true, autoComplete: "name", placeholder: "Ada Lovelace" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", placeholder: "you@company.com" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", placeholder: "Optional" },
  { name: "message", label: "What can we help with?", type: "textarea", required: true, rows: 5, placeholder: "A sentence or two is plenty." },
];

/**
 * Contact section: a direct-channels list (email, phone, office — real links
 * you relink freely) beside a working form skeleton. Fields are configurable,
 * labels are wired to inputs, native validation stays intact, and a
 * successful submit swaps to a confirmation (role="status"). Without an
 * onSubmit handler it runs in demo mode and says so on screen; the default
 * channels use reserved fictional contact details, visibly marked as demo.
 */
export function BlockContact({
  eyebrow = "Contact",
  title = "Talk to a human.",
  description = "Questions about rollout tooling, pricing, or a tricky migration — send them over.",
  channels = [],
  fields = [],
  submitLabel = "Send message",
  successNote = "We read everything. Expect a reply from a real person within one business day.",
  resetLabel = "Write another message",
  onSubmit,
  demoNote = "Demo details: the address and phone number are fictional, and without an onSubmit handler nothing is sent anywhere.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockContactProps) {
  const instanceId = useId();
  const channelItems = channels.length ? channels : DEMO_CHANNELS;
  const fieldItems = fields.length ? fields : DEMO_FIELDS;
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(Array.from(data.entries(), ([key, value]) => [key, String(value)]));
    onSubmit?.(values);
    setSent(true);
  };

  return (
    <section
      className={`vfx-block vfx-contact${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <div className="vfx-contact-body">
            <div>
              <header className="vfx-block-head">
                {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
                {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
                {description ? <p className="vfx-block-lede">{description}</p> : null}
              </header>
              <dl className="vfx-contact-channels">
                {channelItems.map((channel) => (
                  <div className="vfx-contact-channel" key={channel.label}>
                    <dt>{channel.label}</dt>
                    <dd>
                      {channel.href ? <a href={channel.href}>{channel.value}</a> : channel.value}
                    </dd>
                    {channel.note ? <p className="vfx-contact-channel-note">{channel.note}</p> : null}
                  </div>
                ))}
              </dl>
            </div>
            {sent ? (
              <div className="vfx-contact-done" role="status">
                <h3>
                  <span className="vfx-contact-done-badge" aria-hidden="true">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 6.5 4.5 9.5 10.5 2.5" />
                    </svg>
                  </span>
                  Message received.
                </h3>
                <p>{successNote}</p>
                <button type="button" className="vfx-contact-reset" onClick={() => setSent(false)}>
                  {resetLabel}
                </button>
              </div>
            ) : (
              <form className="vfx-contact-form" onSubmit={handleSubmit}>
                {fieldItems.map((field) => {
                  const id = `${instanceId}-${field.name}`;
                  const common = {
                    id,
                    name: field.name,
                    className: "vfx-contact-input",
                    placeholder: field.placeholder,
                    required: field.required ?? false,
                    autoComplete: field.autoComplete,
                  };
                  return (
                    <div className="vfx-contact-field" key={field.name}>
                      <label htmlFor={id}>{field.label}{field.required ? <span aria-hidden="true"> *</span> : null}</label>
                      {field.type === "textarea" ? (
                        <textarea {...common} rows={field.rows ?? 5} />
                      ) : (
                        <input {...common} type={field.type ?? "text"} />
                      )}
                    </div>
                  );
                })}
                <button type="submit" className="vfx-block-btn vfx-block-btn--primary">{submitLabel}</button>
              </form>
            )}
            {demoNote ? <p className="vfx-contact-note vfx-block-subtle" style={{ gridColumn: "1 / -1", margin: 0 }}>{demoNote}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}
