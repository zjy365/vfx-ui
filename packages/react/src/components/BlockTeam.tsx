"use client";

import type { CSSProperties, ReactNode } from "react";
import { BLOCK_BASE_CSS, blockAccentStyle } from "./blockShared";

export type TeamLink = { label: string; href: string };
export type TeamMember = {
  name: string;
  /** Role / title line under the name. */
  role?: ReactNode;
  /** Makes the name (and avatar) a real link. */
  href?: string;
  /** Photo or custom mark; defaults to an initials badge. */
  avatar?: ReactNode;
  /** Small row of profile links (site, socials). */
  links?: readonly TeamLink[];
};

export interface BlockTeamProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  members?: readonly TeamMember[];
  /**
   * Demo content is fictional by design; the marker keeps honest labeling in
   * production. Set to null once you swap in real people.
   */
  demoNote?: ReactNode | null;
  scheme?: "dark" | "light";
  accent?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CSS = `
.vfx-team{padding-block:clamp(64px,9cqw,112px)}
.vfx-team .vfx-block-head{margin-bottom:52px}
.vfx-team-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.vfx-team-card{display:flex;flex-direction:column;gap:18px;padding:28px;background:var(--vb-card);border:1px solid var(--vb-border);border-radius:var(--vb-radius);transition:transform 180ms ease,border-color 180ms ease}
.vfx-team-card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--vb-accent) 45%,var(--vb-border))}
.vfx-team-avatar{display:grid;place-items:center;width:72px;height:72px;flex:none;overflow:hidden;border-radius:50%;border:1px solid var(--vb-border);background:var(--vb-raised);font:500 20px ui-monospace,"SFMono-Regular",monospace;color:var(--vb-muted)}
.vfx-team-avatar img{width:100%;height:100%;object-fit:cover}
.vfx-team-name{font-size:17px;font-weight:500;letter-spacing:-.02em;line-height:1.3}
a.vfx-team-name:hover{text-decoration:underline;text-underline-offset:4px}
.vfx-team-role{font-size:11px;line-height:1.6;color:var(--vb-muted);margin-top:3px}
.vfx-team-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:8px}
.vfx-team-links a{display:inline-flex;align-items:center;min-height:28px;padding:5px 10px;border:1px solid var(--vb-border);border-radius:5px;font-size:10px;color:var(--vb-muted);transition:color 160ms,border-color 160ms}
.vfx-team-links a:hover{color:var(--vb-fg);border-color:var(--vb-accent)}
.vfx-team-mark{margin-top:32px}
@container(max-width:860px){.vfx-team-grid{grid-template-columns:1fr 1fr}}
@container(max-width:520px){.vfx-team-grid{grid-template-columns:1fr}.vfx-team-card{flex-direction:row;align-items:center;padding:20px}.vfx-team-links{margin-top:0;padding-top:0}}
`;

const DEMO_MEMBERS: readonly TeamMember[] = [
  { name: "Iris Candemir", role: "Co-founder & CEO (demo)", href: "#team-iris", links: [{ label: "Site", href: "#iris-site" }] },
  { name: "Theo Lindqvist", role: "Co-founder & CTO (demo)", href: "#team-theo", links: [{ label: "Writing", href: "#theo-writing" }] },
  { name: "Rae Nakamura", role: "Design (demo)", href: "#team-rae", links: [{ label: "Portfolio", href: "#rae-portfolio" }] },
  { name: "Solomon Vane", role: "Platform (demo)", href: "#team-solomon", links: [{ label: "Site", href: "#solomon-site" }] },
  { name: "Ana Ferreyra", role: "Developer experience (demo)", href: "#team-ana", links: [{ label: "Notes", href: "#ana-notes" }] },
  { name: "Kit Marlowe", role: "Reliability (demo)", href: "#team-kit", links: [{ label: "Talks", href: "#kit-talks" }] },
];

function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "•"
  );
}

/**
 * Team grid: cards with an avatar (an image node or an auto-generated
 * initials badge), name, role and profile links. Names can link out; the
 * default people are fictional demo content carrying a visible marker.
 */
export function BlockTeam({
  eyebrow = "Team",
  title = "The people behind the graph.",
  description = "A small crew of release nerds, spread across four time zones.",
  members = [],
  demoNote = "People, roles and links shown here are fictional demo content.",
  scheme = "dark",
  accent,
  className,
  style,
  children,
}: BlockTeamProps) {
  const items = members.length ? members : DEMO_MEMBERS;

  return (
    <section
      className={`vfx-block vfx-team${className ? ` ${className}` : ""}`}
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
            <ul className="vfx-team-grid" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((member) => (
                <li className="vfx-team-card" key={member.name}>
                  {member.href ? (
                    <a className="vfx-team-avatar" href={member.href} aria-label={`${member.name}'s profile`}>
                      <span aria-hidden="true">{member.avatar ?? initialsOf(member.name)}</span>
                    </a>
                  ) : (
                    <span className="vfx-team-avatar" aria-hidden="true">
                      {member.avatar ?? initialsOf(member.name)}
                    </span>
                  )}
                  <div>
                    <h3 className="vfx-team-name" style={{ margin: 0 }}>
                      {member.href ? (
                        <a className="vfx-team-name" href={member.href}>{member.name}</a>
                      ) : (
                        member.name
                      )}
                    </h3>
                    {member.role ? <p className="vfx-team-role">{member.role}</p> : null}
                  </div>
                  {member.links?.length ? (
                    <div className="vfx-team-links">
                      {member.links.map((link) => (
                        <a href={link.href} key={`${link.label}-${link.href}`}>{link.label}</a>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
            {demoNote ? <p className="vfx-team-mark vfx-block-subtle">{demoNote}</p> : null}
          </>
        )}
      </div>
    </section>
  );
}
