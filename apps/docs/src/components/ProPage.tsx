/*
 * VFX UI Pro — pricing / purchase page, routed at /pro (routes.js +
 * App.tsx; generate-sitemap.mjs picks the path up from STATIC_ROUTE_PATHS).
 *
 * Checkout wiring (when Creem products exist) — replace the placeholder
 * `checkoutUrl` with a live session from `../lib/creem`:
 *
 *      import { createCheckout, creemTierVariantId } from "../lib/creem";
 *      const session = await createCheckout(
 *        creemTierVariantId("solo") ?? "",
 *        `${window.location.origin}/pro/welcome`,
 *      );
 *      window.location.assign(session.checkoutUrl);
 *
 * Delivery design behind the purchase flow: `pro/DELIVERY.md`.
 */

import type { MouseEvent } from "react";
import { FooterCollection } from "./FooterCollection";
import { BrandMark } from "./BrandMark";
import { ThemeButtons } from "./ThemeButtons";
import { CheckIcon, MinusIcon } from "./icons";
import type { ThemeMode } from "../theme";
import "./pro-page.css";

type ProPageProps = {
  /** Creem checkout placeholder shared by both tiers. Default "#". */
  checkoutUrl?: string;
  /** Per-tier checkout overrides; fall back to `checkoutUrl`. */
  soloCheckoutUrl?: string;
  teamCheckoutUrl?: string;
  /** Theme wiring matches HomePage; optional so the page renders standalone. */
  theme?: ThemeMode;
  onTheme?: (mode: ThemeMode) => void;
  /** SPA navigation for internal links; falls back to native anchors. */
  onNavigate?: (path: string) => void;
};

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TIERS = [
  {
    id: "solo",
    badge: "Most popular",
    name: "Solo",
    price: "$149",
    cadence: "one-time",
    for: "One developer. Personal, client, and commercial projects.",
    cta: "Buy Solo",
    featured: true,
    features: [
      "Every Pro component and template",
      "Unlimited projects and end products, including SaaS",
      "Private registry — npx shadcn add, you keep the code",
      "12 months of new Pro releases",
      "Email support",
    ],
  },
  {
    id: "team",
    badge: "Up to 5 developers",
    name: "Team",
    price: "$299",
    cadence: "one-time",
    for: "One organization, up to five developers.",
    cta: "Buy Team",
    featured: false,
    features: [
      "Everything in Solo",
      "Five seats within one organization",
      "One shared team registry token",
      "12 months of new Pro releases for all seats",
      "Priority email support",
    ],
  },
] as const;

type Cell = { kind: "yes" } | { kind: "no" } | { kind: "text"; text: string };

const COMPARISON: { label: string; free: Cell; pro: Cell }[] = [
  {
    label: "Open-source component library (Heroes, Footers, Backgrounds, Glass, Blocks)",
    free: { kind: "yes" },
    pro: { kind: "yes" },
  },
  {
    label: "Copy-paste registry, CLI, and agent documentation",
    free: { kind: "yes" },
    pro: { kind: "yes" },
  },
  {
    label: "Advanced WebGPU / shader Pro scenes",
    free: { kind: "no" },
    pro: { kind: "yes" },
  },
  {
    label: "Complete Pro page templates and sections",
    free: { kind: "no" },
    pro: { kind: "yes" },
  },
  {
    label: "Private token-gated registry",
    free: { kind: "no" },
    pro: { kind: "yes" },
  },
  {
    label: "New releases",
    free: { kind: "text", text: "Community cadence" },
    pro: { kind: "text", text: "12 months included, every Pro drop" },
  },
  {
    label: "License",
    free: { kind: "text", text: "MIT, forever" },
    pro: { kind: "text", text: "Commercial, source-available" },
  },
  {
    label: "Support",
    free: { kind: "text", text: "GitHub issues" },
    pro: { kind: "text", text: "Email (Team: priority)" },
  },
];

const FAQ = [
  {
    q: "Does the free library stay open source?",
    a: "Yes. Everything in packages/react and the public registry remains MIT — forever. Pro is a separate, additive tier; nothing you use today moves behind the paywall.",
  },
  {
    q: "What does source-available mean?",
    a: "When you buy, you get a license key and full, human-readable source through the private registry — the same npx shadcn add flow as the free tier, real files, no obfuscation. The license limits redistribution of those sources, not reading, modifying, or shipping them in your projects.",
  },
  {
    q: "One-time payment or subscription?",
    a: "One-time. Your license is perpetual and includes every Pro release published in the 12 months after purchase. Sources you already installed stay licensed forever, even after the release window ends.",
  },
  {
    q: "How do I install Pro components?",
    a: "After checkout you receive a license key. Install any Pro item with npx shadcn add \"https://vfx-ui.com/pro/r/<item>.json?token=<your-key>\". The sources land in your components/ directory — you own the copy.",
  },
  {
    q: "When do I need a Team license?",
    a: "When more than one developer — including contractors — works with the Pro sources in the same organization. Team covers up to five seats; beyond that, add another Team license per five developers.",
  },
  {
    q: "Can I use Pro in client work or a paid SaaS?",
    a: "Yes. Both tiers cover unlimited commercial end products, including client deliverables and paid SaaS. You may not resell or redistribute the Pro sources themselves; see the license terms for the exact wording.",
  },
  {
    q: "What if it is not for me?",
    a: "14-day refund window, provided the Pro materials have not shipped in a product. The license key is revoked on refund — no questions asked.",
  },
] as const;

function CellView({ cell }: { cell: Cell }) {
  if (cell.kind === "yes") return <CheckIcon className="pro-yes" />;
  if (cell.kind === "no") return <MinusIcon />;
  return <span>{cell.text}</span>;
}

export function ProPage({
  checkoutUrl = "#",
  soloCheckoutUrl,
  teamCheckoutUrl,
  theme,
  onTheme,
  onNavigate,
}: ProPageProps) {
  const onLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    const href = anchor?.getAttribute("href");
    if (!anchor || !href?.startsWith("/") || anchor.target || /\.[a-z0-9]+$/i.test(href)) return;
    event.preventDefault();
    onNavigate(href);
  };

  const tierHref = (id: string) =>
    (id === "solo" ? soloCheckoutUrl : teamCheckoutUrl) ?? checkoutUrl;

  return (
    <div className="pro-page" onClick={onLinkClick}>
      <header className="pro-nav">
        <a className="pro-nav-brand" href="/" aria-label="vfx-ui home">
          <BrandMark />
          <span className="pro-nav-tier">PRO</span>
        </a>
        <nav className="pro-nav-links" aria-label="Site">
          <a href="/components">Components</a>
          <a href="/installation">Installation</a>
          <a href="https://github.com/zjy365/vfx-ui" target="_blank" rel="noreferrer">
            GitHub <Arrow diagonal />
          </a>
        </nav>
        <div className="pro-nav-actions">
          {theme && onTheme ? <ThemeButtons compact mode={theme} onChange={onTheme} /> : null}
        </div>
      </header>

      <main>
        <section className="pro-hero" aria-labelledby="pro-title">
          <div className="pro-hero-inner">
            <p className="pro-eyebrow">
              <strong>VFX UI PRO</strong>
              <span>Source-available · One-time purchase</span>
            </p>
            <h1 id="pro-title">
              Deeper than
              <br />
              <span>open source.</span>
            </h1>
            <p>
              The same craft as the free library, turned all the way up: advanced
              WebGPU scenes, complete production templates, and the effects that
              never fit in an MIT catalog. Pay once, keep the code.
            </p>
            <p className="pro-hero-note">
              The free tier stays <a href="https://github.com/zjy365/vfx-ui">MIT, forever</a>.
              Pro is additive — nothing you use today moves behind a paywall.
            </p>
          </div>
        </section>

        <section className="pro-section" aria-labelledby="pro-pricing-title">
          <h2 className="pro-section-heading" id="pro-pricing-title">
            One payment. Yours to keep.
          </h2>
          <p className="pro-section-lede">
            No subscription, no seat meters running. A perpetual license with
            twelve months of new Pro releases included.
          </p>
          <div className="pro-tiers">
            {TIERS.map((tier) => (
              <article
                key={tier.id}
                className={`pro-tier${tier.featured ? " pro-tier-featured" : ""}`}
              >
                <span className="pro-tier-badge">{tier.badge}</span>
                <h3>{tier.name}</h3>
                <p className="pro-tier-price">
                  <strong>{tier.price}</strong>
                  <span>{tier.cadence}</span>
                </p>
                <p className="pro-tier-for">{tier.for}</p>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="pro-tier-cta"
                  href={tierHref(tier.id)}
                  data-tier={tier.id}
                >
                  {tier.cta} <Arrow />
                </a>
              </article>
            ))}
          </div>
          <p className="pro-tiers-note">
            Checkout runs through Creem (merchant of record; cards and Alipay).
            14-day refund window.{" "}
            <a href="https://github.com/zjy365/vfx-ui/blob/main/pro/LICENSE-PRO.md">License terms</a> ·{" "}
            <a href="https://github.com/zjy365/vfx-ui/blob/main/pro/DELIVERY.md">Delivery details</a>
          </p>
        </section>

        <section className="pro-section" aria-labelledby="pro-compare-title">
          <h2 className="pro-section-heading" id="pro-compare-title">
            Free versus Pro.
          </h2>
          <p className="pro-section-lede">
            The free catalog is complete and usable on its own. Pro adds the layer
            that takes real GPU engineering to build.
          </p>
          <div className="pro-table-wrap">
            <table className="pro-table">
              <thead>
                <tr>
                  <th scope="col">What you get</th>
                  <th scope="col">Free</th>
                  <th scope="col">
                    <span className="pro-col-pro">Pro</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>
                      <CellView cell={row.free} />
                    </td>
                    <td>
                      <CellView cell={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pro-section" aria-labelledby="pro-faq-title">
          <h2 className="pro-section-heading" id="pro-faq-title">
            Questions, answered.
          </h2>
          <p className="pro-section-lede">
            Licensing, delivery, and refunds — the short versions. The full terms
            ship with your license key.
          </p>
          <div className="pro-faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pro-final" aria-labelledby="pro-final-title">
          <div className="pro-final-inner">
            <h2 id="pro-final-title">Ship something unforgettable.</h2>
            <p>
              The free tier already turns heads. Pro is what they remember at the
              demo.
            </p>
            <div className="pro-final-actions">
              <a className="pro-final-buy" href={tierHref("solo")}>
                Buy Solo — $149 <Arrow />
              </a>
              <a className="pro-final-buy" href={tierHref("team")}>
                Buy Team — $299 <Arrow />
              </a>
              <a className="pro-final-ghost" href="/components">
                Browse the free library
              </a>
            </div>
            <p className="pro-final-fineprint">
              One-time purchase · 12 months of Pro releases · 14-day refund
              window
            </p>
          </div>
        </section>
      </main>

      <FooterCollection />
    </div>
  );
}
