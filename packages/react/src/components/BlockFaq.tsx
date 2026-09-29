"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export interface BlockFaqProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  items?: readonly FaqItem[];
  /** Allow multiple answers open at once (default: one at a time). */
  multiple?: boolean;
  /** Contact line rendered under the list. */
  contact?: { text: ReactNode; action: { label: string; href: string } } | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-faq{padding-block:clamp(64px,9cqw,112px)}
.vfx-faq-body{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,6fr);gap:clamp(32px,7cqw,100px);align-items:start}
.vfx-faq .vfx-block-head{position:sticky;top:100px;gap:24px}.vfx-faq .vfx-block-title{font-size:clamp(34px,4cqw,48px);max-width:12ch}
.vfx-faq-list{border-top:1px solid var(--vb-border);counter-reset:faq}
.vfx-faq-item{border-bottom:1px solid var(--vb-border);counter-increment:faq}
.vfx-faq-question{display:flex;align-items:center;gap:16px;width:100%;padding:24px 0;background:none;border:0;color:var(--vb-fg);font:500 15px/1.5 var(--vb-font);letter-spacing:-.02em;text-align:left;cursor:pointer}
.vfx-faq-question::before{content:counter(faq,decimal-leading-zero);color:var(--vb-faint);font:10px ui-monospace,monospace;margin-right:4px}
.vfx-faq-icon{display:grid;place-items:center;flex:none;width:24px;height:24px;margin-left:auto;border-radius:4px;background:var(--vb-card);color:var(--vb-muted);transition:transform 200ms}
.vfx-faq-icon svg{width:10px;height:10px}.vfx-faq-question:hover .vfx-faq-icon{background:var(--vb-border)}.vfx-faq-question[aria-expanded="true"] .vfx-faq-icon{transform:rotate(45deg);color:var(--vb-fg)}
.vfx-faq-answer-wrapper{display:grid;grid-template-rows:0fr;transition:grid-template-rows 240ms ease}.vfx-faq-item[data-open="true"] .vfx-faq-answer-wrapper{grid-template-rows:1fr}
.vfx-faq-answer{overflow:hidden;min-height:0;visibility:hidden;transition:visibility 240ms}.vfx-faq-item[data-open="true"] .vfx-faq-answer{visibility:visible}
.vfx-faq-answer-inner{padding:0 30px 24px 34px;color:var(--vb-muted);font-size:13px;line-height:1.85}.vfx-faq-answer-inner p+p{margin-top:12px}.vfx-faq-answer-inner a{text-decoration:underline;text-underline-offset:3px}
.vfx-faq-contact{margin-top:20px;font-size:12px;line-height:1.7;color:var(--vb-muted);padding-top:24px;border-top:1px solid var(--vb-border)}.vfx-faq-contact .vfx-block-btn{margin-top:14px}
@container(max-width:760px){.vfx-faq-body{grid-template-columns:1fr;gap:40px}.vfx-faq .vfx-block-head{position:static}.vfx-faq .vfx-block-title{max-width:17ch}.vfx-faq-question{font-size:14px}}
`;

const DEMO_FAQ: readonly FaqItem[] = [
  {
    question: "How long does setup actually take?",
    answer: "Most teams connect a repo and see their first release graph within ten minutes. The OAuth flow indexes services, owners and environments automatically; nothing is hand-drawn unless you want it to be.",
  },
  {
    question: "Does Orbit store our source code?",
    answer: "No. Orbit reads metadata — branches, tags, workflow runs and deploy events. Code stays in your forge. For self-hosted forges we mirror metadata into your own region; the graph renders identically.",
  },
  {
    question: "What happens when the canary pauses a rollout?",
    answer: "Orbit freezes traffic at the current percentage, opens an incident thread with the offending metric attached, and pages the owning team. Unwinding is one click; the whole decision is replayable afterwards.",
  },
  {
    question: "Can we keep our existing deploy tooling?",
    answer: "Yes. Orbit sits alongside your pipeline rather than replacing it — GitHub Actions, GitLab CI, Argo, or a home-grown bash relic all emit the same events. If it can call a webhook, it can join the graph.",
  },
  {
    question: "How is pricing counted for contractors and bots?",
    answer: "Viewers are free and unlimited. Paid seats are people or service accounts that trigger releases. Rotate them any time; the graph keeps its history either way.",
  },
  {
    question: "Is there an on-prem or air-gapped option?",
    answer: "Enterprise plans can run the control plane inside your VPC with no outbound calls. Graph sync between regions uses signed, customer-held keys.",
  },
];

function PlusIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6 1.5v9M1.5 6h9" />
    </svg>
  );
}

/**
 * FAQ accordion: real disclosure semantics (button + aria-expanded +
 * aria-controls, arrow-key traversal, Home/End), animated with the CSS
 * grid-rows trick so height animates without JS measurement — long answers,
 * links and lists inside answers all work. One item open at a time by
 * default; pass multiple to allow several.
 */
export function BlockFaq({
  eyebrow = "FAQ",
  title = "A few things worth knowing.",
  description = "The practical details, before you get started.",
  items = [],
  multiple = false,
  contact = { text: "Still have something on your mind?", action: { label: "Talk to a human", href: "#contact" } },
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockFaqProps) {
  const instanceId = useId();
  const demoItems = items.length ? items : DEMO_FAQ;
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (index: number) => {
    setOpen((current) => {
      const isOpen = current.has(index);
      if (multiple) {
        const next = new Set(current);
        if (isOpen) next.delete(index);
        else next.add(index);
        return next;
      }
      return isOpen ? new Set<number>() : new Set([index]);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = demoItems.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    questionRefs.current[next]?.focus();
  };

  return (
    <section
      className={`vfx-block vfx-faq${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <>
            <div className="vfx-faq-body">
              <header className="vfx-block-head">
                {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
                {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
                {description ? <p className="vfx-block-lede">{description}</p> : null}
                {contact ? (
                  <div className="vfx-faq-contact">
                    {contact.text}
                    <br />
                    <a className="vfx-block-btn vfx-block-btn--ghost vfx-block-btn--sm" href={contact.action.href}>{contact.action.label}</a>
                  </div>
                ) : null}
              </header>
              <div className="vfx-faq-list">
                {demoItems.map((item, index) => {
                  const isOpen = open.has(index);
                  return (
                    <div className="vfx-faq-item" data-open={isOpen} key={item.question}>
                      <h3 style={{ margin: 0 }}>
                        <button
                          type="button"
                          className="vfx-faq-question"
                          aria-expanded={isOpen}
                          aria-controls={`${instanceId}-panel-${index}`}
                          id={`${instanceId}-button-${index}`}
                          ref={(el) => { questionRefs.current[index] = el; }}
                          onClick={() => toggle(index)}
                          onKeyDown={(event) => onKeyDown(event, index)}
                        >
                          {item.question}
                          <span className="vfx-faq-icon" aria-hidden="true"><PlusIcon /></span>
                        </button>
                      </h3>
                      <div
                        className="vfx-faq-answer-wrapper"
                        role="region"
                        id={`${instanceId}-panel-${index}`}
                        aria-labelledby={`${instanceId}-button-${index}`}
                      >
                        <div className="vfx-faq-answer">
                          <div className="vfx-faq-answer-inner">{item.answer}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
