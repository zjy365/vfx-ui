"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockActionButton, blockAccentStyle, type BlockAction } from "./blockShared";

export type PricingPlan = {
  name: string;
  /** Price per month in your display currency, shown for both periods. */
  priceMonthly: number;
  /** Price per month when billed annually; omit for plans without discounting. */
  priceAnnual?: number;
  /** "month" for subscriptions; "once" for one-time or free plans. */
  basis?: "month" | "once";
  description?: ReactNode;
  features?: readonly ReactNode[];
  cta?: BlockAction | null;
  /** Highlights the recommended plan. */
  featured?: boolean;
  badge?: string;
};

export interface BlockPricingProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  plans?: readonly PricingPlan[];
  /** Show the monthly/annual switch (hidden when plans lack annual pricing). */
  periodToggle?: boolean;
  defaultPeriod?: "monthly" | "annual";
  /** Label for the annual discount, e.g. "2 months free". */
  annualNote?: string;
  footnote?: ReactNode;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-pricing{padding-block:clamp(64px,9cqw,112px)}
.vfx-pricing .vfx-block-head{gap:18px;margin-bottom:32px}
.vfx-pricing-toggle-row{display:flex;justify-content:center;margin-bottom:48px}
.vfx-pricing-toggle{display:flex;padding:4px;border:1px solid var(--vb-border);border-radius:8px;background:var(--vb-card);gap:4px}
.vfx-pricing-toggle button{min-height:36px;display:flex;align-items:center;gap:10px;border:0;border-radius:5px;padding:8px 14px;background:transparent;color:var(--vb-muted);font:500 12px var(--vb-font);cursor:pointer;transition:background 180ms,color 180ms}
.vfx-pricing-toggle button[aria-pressed="true"]{background:var(--vb-fg);color:var(--vb-bg);box-shadow:0 1px 3px #00000015}
.vfx-pricing-save{font:9px ui-monospace,monospace;opacity:.7}
.vfx-pricing-grid{display:grid;grid-template-columns:repeat(var(--vfx-plans,3),minmax(0,1fr));border:1px solid var(--vb-border);border-radius:12px;overflow:hidden}
.vfx-pricing-plan{position:relative;display:flex;flex-direction:column;gap:24px;padding:32px;min-width:0;background:var(--vb-bg)}
.vfx-pricing-plan+.vfx-pricing-plan{border-left:1px solid var(--vb-border)}
.vfx-pricing-plan--featured{background:var(--vb-card);box-shadow:inset 0 3px var(--vb-accent)}
.vfx-pricing-plan-head{display:flex;justify-content:space-between;gap:8px;align-items:center;min-height:28px}
.vfx-pricing-plan-head h3{font-size:17px;letter-spacing:-.03em;font-weight:500}
.vfx-pricing-badge{font:9px/1.3 ui-monospace,monospace;background:var(--vb-accent);color:var(--vb-accent-ink);padding:5px 8px;border-radius:4px}
.vfx-pricing-price{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.vfx-pricing-amount{font-size:clamp(38px,5cqw,60px);font-weight:400;letter-spacing:-.065em;line-height:1.1;font-variant-numeric:tabular-nums}
.vfx-pricing-basis{font-size:10px;color:var(--vb-muted)}
.vfx-pricing-period-note{font-size:10px;color:var(--vb-faint);min-height:16px;margin-top:7px!important}
.vfx-pricing-description{font-size:13px;color:var(--vb-muted)!important;line-height:1.6;min-height:42px}
.vfx-pricing-features{display:flex;flex-direction:column;gap:15px;list-style:none;margin:0 0 12px;padding:24px 0 0;border-top:1px solid var(--vb-border)}
.vfx-pricing-features li{display:flex;gap:10px;font-size:12px;line-height:1.5;color:var(--vb-muted)}
.vfx-pricing-features li::before{content:"✓";color:var(--vb-muted);font-size:12px}
.vfx-pricing-plan .vfx-block-btn{margin-top:auto;width:100%}
.vfx-pricing-footnote{margin-top:24px;text-align:center}
@container(max-width:760px){.vfx-pricing-grid{grid-template-columns:1fr;max-width:520px;margin:auto}.vfx-pricing-plan+.vfx-pricing-plan{border-left:0;border-top:1px solid var(--vb-border)}.vfx-pricing-plan{padding:28px}.vfx-pricing-description{min-height:0}}
`;

function formatPrice(value: number) {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

/**
 * Pricing: plan cards with a working monthly/annual switch — the amounts,
 * basis lines and savings note all re-render from data, so the switch can
 * never lie. No payment backend; CTAs are plain links or buttons you wire up.
 */
export function BlockPricing({
  eyebrow = "Pricing",
  title = "Good work deserves a simple plan.",
  description = "A place for your side project. Room for your whole team. Start small and grow at your own pace.",
  plans = [],
  periodToggle = true,
  defaultPeriod = "annual",
  annualNote = "2 months free",
  footnote = "Illustrative pricing for Orbit, a fictional product.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockPricingProps) {
  const demoPlans: readonly PricingPlan[] = [
    {
      name: "Solo",
      priceMonthly: 0,
      basis: "month",
      description: "For personal projects and evals.",
      features: ["1 release graph", "7-day replays", "Community support"],
      cta: { label: "Start free", href: "#start" },
    },
    {
      name: "Team",
      priceMonthly: 24,
      priceAnnual: 20,
      basis: "month",
      featured: true,
      badge: "Most popular",
      description: "Per seat. For teams shipping weekly.",
      features: ["Unlimited graphs and flags", "90-day replays", "Canary automation", "Slack + Linear sync"],
      cta: { label: "Start 14-day trial", href: "#trial" },
    },
    {
      name: "Enterprise",
      priceMonthly: 89,
      priceAnnual: 74,
      basis: "month",
      description: "Per seat. For platform organizations.",
      features: ["SSO / SCIM", "Audit exports + residency", "Custom retention", "Named support engineer"],
      cta: { label: "Talk to us", href: "#contact" },
    },
  ];
  const items = plans.length ? plans : demoPlans;
  const supportsAnnual = items.some((plan) => plan.priceAnnual !== undefined && plan.basis !== "once");
  const [period, setPeriod] = useState<"monthly" | "annual">(defaultPeriod);
  const effectivePeriod: "monthly" | "annual" = supportsAnnual && periodToggle ? period : "monthly";

  const switchPeriod = (next: "monthly" | "annual") => {
    if (next === effectivePeriod) return;
    setPeriod(next);
  };

  return (
    <section
      className={`vfx-block vfx-pricing${className ? ` ${className}` : ""}`}
      data-scheme={scheme}
      style={{ "--vfx-plans": Math.min(items.length, 4), ...blockAccentStyle(accent, style) } as CSSProperties}
    >
      <style>{BLOCK_BASE_CSS}{CSS}</style>
      <div className="vfx-block-container">
        {children ?? (
          <>
            <header className="vfx-block-head vfx-block-head--center">
              {eyebrow ? <p className="vfx-block-eyebrow">{eyebrow}</p> : null}
              {title != null ? <h2 className="vfx-block-title">{title}</h2> : null}
              {description ? <p className="vfx-block-lede">{description}</p> : null}
            </header>
            {periodToggle && supportsAnnual ? (
              <div className="vfx-pricing-toggle-row">
                <div className="vfx-pricing-toggle" role="group" aria-label="Billing period">
                  <button type="button" aria-pressed={effectivePeriod === "monthly"} onClick={() => switchPeriod("monthly")}>
                    Monthly
                  </button>
                  <button type="button" aria-pressed={effectivePeriod === "annual"} onClick={() => switchPeriod("annual")}>
                    Annual
                    {annualNote ? <span className="vfx-pricing-save">{annualNote}</span> : null}
                  </button>
                </div>
              </div>
            ) : null}
            <div className="vfx-pricing-grid">
              {items.map((plan) => {
                const usesAnnual = effectivePeriod === "annual" && plan.priceAnnual !== undefined;
                const amount = plan.basis === "once" ? plan.priceMonthly : usesAnnual ? plan.priceAnnual ?? plan.priceMonthly : plan.priceMonthly;
                return (
                  <article className={`vfx-pricing-plan${plan.featured ? " vfx-pricing-plan--featured" : ""}`} key={plan.name}>
                    <div className="vfx-pricing-plan-head">
                      <h3>{plan.name}</h3>
                      {plan.badge ? <span className="vfx-pricing-badge">{plan.badge}</span> : null}
                    </div>
                    <div>
                      <div className="vfx-pricing-price">
                        <span
                          className="vfx-pricing-amount"
                          data-zero={amount === 0}
                        >
                          {formatPrice(amount)}
                        </span>
                        <span className="vfx-pricing-basis">
                          {plan.basis === "once" ? "one-time" : "/ seat / month"}
                        </span>
                      </div>
                      <p className="vfx-pricing-period-note">
                        {plan.basis !== "once" && supportsAnnual
                          ? usesAnnual ? "billed annually" : "billed monthly"
                          : ""}
                      </p>
                    </div>
                    {plan.description ? <p className="vfx-pricing-description">{plan.description}</p> : null}
                    {plan.features?.length ? (
                      <ul className="vfx-pricing-features">
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    ) : null}
                    {plan.cta ? <BlockActionButton action={plan.cta} variant={plan.featured ? "accent" : "ghost"} /> : null}
                  </article>
                );
              })}
            </div>
            {footnote ? <p className="vfx-pricing-footnote vfx-block-subtle">{footnote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
