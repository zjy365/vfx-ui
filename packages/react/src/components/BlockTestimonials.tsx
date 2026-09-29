"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type Testimonial = {
  quote: ReactNode;
  name: string;
  /** Role / company line under the name. */
  role?: string;
  href?: string;
  /** Link text for the case-study link (defaults to "Read the story"). */
  linkLabel?: string;
  /** Replace the monogram avatar. */
  avatar?: ReactNode;
};

export interface BlockTestimonialsProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  testimonials?: readonly Testimonial[];
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null to remove it once you swap in real quotes.
   */
  demoNote?: ReactNode | null;
  /** One testimonial is pulled out as a large feature quote. */
  featured?: boolean;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-testimonials{padding-block:clamp(64px,9cqw,112px)}
.vfx-testimonials .vfx-block-head{margin-bottom:52px}
.vfx-testimonials-featured{display:grid;grid-template-columns:72px 1fr;gap:28px;padding:40px 0 48px;border-block:1px solid var(--vb-border)}
.vfx-testimonials-featured blockquote{margin:0 0 28px;font-size:clamp(26px,3.5cqw,42px);line-height:1.3;font-weight:400;letter-spacing:-.045em;max-width:32ch}
.vfx-testimonials-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin-top:24px}
.vfx-testimonial{display:flex;flex-direction:column;gap:24px;padding:28px;border-bottom:1px solid var(--vb-border)}.vfx-testimonial:nth-child(3n+1){padding-left:0}.vfx-testimonial:not(:nth-child(3n+1)){border-left:1px solid var(--vb-border)}
.vfx-testimonial blockquote{margin:0;font-size:14px;line-height:1.8;letter-spacing:-.015em;color:var(--vb-muted)}
.vfx-testimonial-person{display:flex;align-items:center;gap:12px;margin-top:auto}.vfx-testimonial-avatar{display:grid;place-items:center;width:36px;height:36px;flex:none;overflow:hidden;border-radius:6px;border:1px solid var(--vb-border);background:var(--vb-card);font:11px ui-monospace,monospace;color:var(--vb-muted)}.vfx-testimonial-avatar img{width:100%;height:100%;object-fit:cover}
.vfx-testimonial-name{display:block;font-size:12px;font-weight:500;line-height:1.5}.vfx-testimonial-role{display:block;font-size:10px;color:var(--vb-faint);line-height:1.6}
.vfx-testimonial-link{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--vb-muted);width:fit-content}.vfx-testimonial-link svg{width:12px;height:12px}.vfx-testimonial-link:hover{text-decoration:underline;text-underline-offset:4px}
.vfx-testimonials-mark{margin-top:28px;font:9px/1.7 ui-monospace,monospace;color:var(--vb-faint)!important}
@container(max-width:760px){.vfx-testimonials-grid{grid-template-columns:1fr 1fr}.vfx-testimonial{padding:24px!important;border-left:0!important}.vfx-testimonial:nth-child(even){border-left:1px solid var(--vb-border)!important}.vfx-testimonials-featured{grid-template-columns:36px 1fr;gap:20px}}
@container(max-width:480px){.vfx-testimonials-grid{grid-template-columns:1fr}.vfx-testimonial{padding:24px 0!important;border-left:0!important}.vfx-testimonial:nth-child(even){border-left:0!important}.vfx-testimonials-featured{grid-template-columns:1fr}.vfx-testimonials-featured>svg{width:28px!important}}
`;

const DEMO_TESTIMONIALS: readonly Testimonial[] = [
  { quote: "We stopped writing status updates. The replay is the status update — our Friday review went from an hour to fifteen minutes.", name: "Mara Ellison", role: "Head of Platform, Fieldnote (demo)", href: "#case-fieldnote" },
  { quote: "The canary pause caught a regression our dashboards never surfaced. That single Friday paid for the year.", name: "Deniz Okafor", role: "Staff Engineer, Brightcar (demo)", href: "#case-brightcar" },
  { quote: "Adoption was the surprise. Teams that ignored the old wiki check Orbit daily — the graph is just easier to read.", name: "Priya Raman", role: "VP Engineering, loopwell (demo)", href: "#case-loopwell" },
  { quote: "Auditors asked for our release trail. We exported it in one click and the conversation ended there.", name: "Jonas Feld", role: "CTO, Arlo Health (demo)", href: "#case-arlo" },
  { quote: "It reads our repo better than we do. Ownership edges appeared that nobody remembered to document.", name: "June Park", role: "Engineering Manager, Stackform (demo)", href: "#case-stackform" },
  { quote: "Migrating took an afternoon. We compared notes with another team the next week and their migration took an afternoon too.", name: "Tomás Rivera", role: "Platform Lead, Quantelle (demo)", href: "#case-quantelle" },
];

function QuoteMark() {
  return (
    <svg viewBox="0 0 48 40" fill="currentColor" aria-hidden="true" style={{ width: "clamp(36px,4cqw,52px)", color: "var(--vb-accent)", opacity: 0.85 }}>
      <path d="M0 40V22.4C0 9.6 7.2 1.9 20.4 0l2.4 6.8c-7 1.8-10.8 5.5-11.4 11h10.8V40H0Zm25.2 0V22.4C25.2 9.6 32.4 1.9 45.6 0L48 6.8c-7 1.8-10.8 5.5-11.4 11h10.8V40H25.2Z" transform="scale(.9)" />
    </svg>
  );
}

function Person({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name.split(/\s+/).map((part) => part.charAt(0)).slice(0, 2).join("").toUpperCase();
  return (
    <div className="vfx-testimonial-person">
      <span className="vfx-testimonial-avatar" aria-hidden="true">{testimonial.avatar ?? initials}</span>
      <span>
        <span className="vfx-testimonial-name">{testimonial.name}</span>
        {testimonial.role ? <span className="vfx-testimonial-role">{testimonial.role}</span> : null}
      </span>
    </div>
  );
}

/**
 * Testimonials and case-study teasers. Quotes, authors and roles are props —
 * the defaults are fictional demo content and carry a visible marker, so a
 * screenshot can never be mistaken for a real customer claim.
 */
export function BlockTestimonials({
  eyebrow = "Loved by release teams",
  title = "Built around the people who build.",
  description = "Less time coordinating. More time doing the work that matters.",
  testimonials = [],
  demoNote = "All quotes, people and companies on this page are fictional demo content.",
  featured = true,
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockTestimonialsProps) {
  const items = testimonials.length ? testimonials : DEMO_TESTIMONIALS;
  const first = items[0] ?? { quote: "", name: "" };
  const rest = featured ? items.slice(1) : items;

  return (
    <section
      className={`vfx-block vfx-testimonials${className ? ` ${className}` : ""}`}
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
            {featured ? (
              <figure className="vfx-testimonials-featured" style={{ margin: 0 }}>
                <QuoteMark />
                <div>
                  <blockquote>“{first.quote}”</blockquote>
                  <Person testimonial={first} />
                  {first.href ? (
                    <a className="vfx-testimonial-link" href={first.href} style={{ marginTop: 12 }}>
                      {first.linkLabel ?? "Read the story"}
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" /></svg>
                    </a>
                  ) : null}
                </div>
              </figure>
            ) : null}
            <div className="vfx-testimonials-grid">
              {rest.map((testimonial) => (
                <figure className="vfx-testimonial" key={testimonial.name} style={{ margin: 0 }}>
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <Person testimonial={testimonial} />
                  {testimonial.href ? (
                    <a className="vfx-testimonial-link" href={testimonial.href}>
                      {testimonial.linkLabel ?? "Read the story"}
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" /></svg>
                    </a>
                  ) : null}
                </figure>
              ))}
            </div>
            {demoNote ? <p className="vfx-testimonials-mark">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
