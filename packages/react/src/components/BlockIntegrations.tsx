"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, BlockActionButton, blockAccentStyle, type BlockAction } from "./blockShared";

export type Integration = {
  name: string;
  /** Short line describing the integration. */
  description?: string;
  href?: string;
  /** Replace the built-in monogram tile with your own mark. */
  logo?: ReactNode;
};

export interface BlockIntegrationsProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Your product at the center of the diagram. */
  brand?: string;
  /** Mark for the center node; defaults to a monogram of brand. */
  logo?: ReactNode;
  integrations?: readonly Integration[];
  action?: BlockAction | null;
  /** "orbit" draws a hub diagram on wide screens; "grid" always uses the grid. */
  layout?: "orbit" | "grid";
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-integrations{padding-block:clamp(64px,9cqw,112px);overflow:clip}
.vfx-integrations .vfx-block-head{margin-bottom:48px}
.vfx-integrations-diagram{position:relative;height:420px;max-width:860px;margin:0 auto 32px;display:grid;place-items:center;background-image:radial-gradient(var(--vb-border) .7px,transparent .7px);background-size:20px 20px;mask-image:linear-gradient(90deg,transparent,black 12%,black 88%,transparent)}
.vfx-integrations-rings{position:absolute;inset:0;display:grid;place-items:center}.vfx-integrations-ring{position:absolute;width:36%;aspect-ratio:1;border-radius:50%;border:1px solid var(--vb-border)}.vfx-integrations-ring:nth-child(2){width:72%;aspect-ratio:1.7}
.vfx-integrations-hub{position:relative;display:grid;place-items:center;width:90px;height:90px;border-radius:20px;border:1px solid color-mix(in srgb,var(--vb-accent) 45%,var(--vb-border));background:var(--vb-bg);color:var(--vb-accent);font:italic 44px Georgia,serif;box-shadow:0 0 0 12px var(--vb-bg),0 0 0 13px var(--vb-border)}
.vfx-integrations-node{position:absolute;left:var(--node-x);top:var(--node-y);translate:-50% -50%;display:flex;align-items:center;gap:10px;min-width:134px;padding:12px;border-radius:8px;border:1px solid var(--vb-border);background:var(--vb-raised);box-shadow:0 6px 18px #00000012;transition:transform 180ms,border-color 180ms}
.vfx-integrations-node:hover{transform:translateY(-3px);border-color:var(--vb-accent)}
.vfx-integrations-tile{display:grid;place-items:center;width:30px;height:30px;flex:none;font:600 12px var(--vb-font);border:1px solid var(--vb-border);border-radius:6px;color:var(--vb-fg);background:var(--vb-bg)}.vfx-integrations-tile svg{width:18px;height:18px}
.vfx-integrations-name{font-size:11px;font-weight:500}
.vfx-integrations-grid{display:none;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.vfx-integrations-grid .vfx-integrations-node{position:static;translate:none;min-width:0;padding:22px 18px;box-shadow:none;background:var(--vb-card)}
.vfx-integrations-note{margin-top:32px}
.vfx-integrations[data-layout="grid"] .vfx-integrations-diagram{display:none}.vfx-integrations[data-layout="grid"] .vfx-integrations-grid{display:grid}
@container(max-width:760px){.vfx-integrations-diagram{display:none}.vfx-integrations-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.vfx-integrations-grid .vfx-integrations-node{padding:18px 14px}}
`;

const NODE_NAMES = ["GitHub", "Linear", "Slack", "Datadog", "Figma", "PagerDuty", "Notion", "Vercel"];
const NODE_ABBR: Record<string, string> = { GitHub: "GH", Linear: "LN", Slack: "SL", Datadog: "DD", Figma: "FG", PagerDuty: "PD", Notion: "N", Vercel: "▲" };
/** Positions on two ellipses (percent of diagram box), hand-tuned for balance. */
const ORBIT_POSITIONS = [
  { x: 18, y: 22 }, { x: 82, y: 22 }, { x: 12, y: 50 }, { x: 88, y: 50 },
  { x: 18, y: 78 }, { x: 82, y: 78 }, { x: 50, y: 12 }, { x: 50, y: 88 },
];

function MonogramTile({ integration }: { integration: Integration }) {
  return (
    <span className="vfx-integrations-tile" aria-hidden="true">
      {integration.logo ?? (NODE_ABBR[integration.name] ?? integration.name.slice(0, 2).toUpperCase())}
    </span>
  );
}

/**
 * Integrations hub: your product at the center of two connection rings of
 * tools (desktop), with an always-available link grid below and on touch
 * layouts. Every node is a real link you can rebrand, relink and replace.
 * Tiles stay upright and static; a compact grid is used on narrow screens.
 */
export function BlockIntegrations({
  eyebrow = "Works with your stack",
  title = "Good company for your tools.",
  description = "Keep what works. Connect the tools your team already knows, and bring the whole release into focus.",
  brand = "Orbit",
  logo,
  integrations = [],
  action = { label: "Browse all integrations", href: "#integrations" },
  layout = "orbit",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockIntegrationsProps) {
  const demoIntegrations: readonly Integration[] = NODE_NAMES.map((name) => ({
    name,
    href: "#integrations",
    description: `Sync releases with ${name}. (Demo tile.)`,
  }));
  const items = integrations.length ? integrations : demoIntegrations;
  const orbitNodes = items.slice(0, 8);
  const hub = logo ?? brand.trim().charAt(0).toUpperCase();

  return (
    <section
      className={`vfx-block vfx-integrations${className ? ` ${className}` : ""}`}
      data-layout={layout}
      data-orbit={layout === "orbit"}
      data-scheme={scheme}
      style={blockAccentStyle(accent, style)}
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
            <div className="vfx-integrations-diagram" aria-hidden={layout === "grid"}>
              <div className="vfx-integrations-rings">
                <span className="vfx-integrations-ring" />
                <span className="vfx-integrations-ring" />
              </div>
              <div className="vfx-integrations-orbit" style={{ position: "absolute", inset: 0 } as CSSProperties}>
                {orbitNodes.map((integration, index) => {
                  const position = ORBIT_POSITIONS[index % ORBIT_POSITIONS.length] ?? ORBIT_POSITIONS[0]!;
                  return (
                    <a
                      className="vfx-integrations-node"
                      href={integration.href ?? "#integrations"}
                      key={integration.name}
                      style={{ "--node-x": `${position.x}%`, "--node-y": `${position.y}%` } as CSSProperties}
                      tabIndex={layout === "grid" ? -1 : 0}
                      aria-label={integration.description ?? integration.name}
                      title={integration.description}
                    >
                      <MonogramTile integration={integration} />
                      <span className="vfx-integrations-name">{integration.name}</span>
                    </a>
                  );
                })}
              </div>
              <div className="vfx-integrations-hub">{hub}</div>
            </div>
            <div className="vfx-integrations-grid">
              {items.map((integration) => (
                <a
                  className="vfx-integrations-node"
                  href={integration.href ?? "#integrations"}
                  key={`grid-${integration.name}`}
                  aria-label={integration.description ?? integration.name}
                >
                  <MonogramTile integration={integration} />
                  <span className="vfx-integrations-name">{integration.name}</span>
                </a>
              ))}
            </div>
            {action ? (
              <div className="vfx-integrations-note vfx-block-actions" style={{ justifyContent: "center" }}>
                <BlockActionButton action={action} variant="ghost" />
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
