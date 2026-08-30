import type { MouseEvent, ReactNode } from "react";
import { browseCategoryRoutePath, STATIC_ROUTE_PATHS } from "../routes.js";

type MainContentFooterProps = {
  onNavigate: (path: string) => void;
};

type FooterLinkProps = {
  children: ReactNode;
  href: string;
  onNavigate: (path: string) => void;
};

const PRODUCT_LINKS = [
  { href: STATIC_ROUTE_PATHS.browse, label: "Browse" },
  { href: STATIC_ROUTE_PATHS.installation, label: "Installation" },
] as const;

const EXPLORE_LINKS = [
  { href: browseCategoryRoutePath("Backgrounds"), label: "Shader Backgrounds" },
  { href: browseCategoryRoutePath("Text"), label: "Text Effects" },
  { href: browseCategoryRoutePath("Glass"), label: "Glass Surfaces" },
  { href: browseCategoryRoutePath("Data"), label: "Data Visuals" },
] as const;

function FooterLink({ children, href, onNavigate }: FooterLinkProps) {
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(href);
  };

  return <a href={href} onClick={follow}>{children}</a>;
}

export function MainContentFooter({ onNavigate }: MainContentFooterProps) {
  return (
    <footer className="main-content-footer" data-main-content-footer aria-label="vfx-ui footer">
      <div className="main-content-footer__grid">
        <div className="main-content-footer__identity">
          <FooterLink href={STATIC_ROUTE_PATHS.browse} onNavigate={onNavigate}>
            <span className="main-content-footer__brand" aria-label="VFX UI">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" />
                <path d="M5 12.2c4.3 4.2 8.2 4.8 12.4.9 4.1-3.7 7.7-4.5 9.6-2.9" />
                <path d="M5 19.7c4.3 4.2 8.2 4.8 12.4.9 4.1-3.7 7.7-4.5 9.6-2.9" />
              </svg>
              <strong>vfx-ui</strong>
            </span>
          </FooterLink>
          <p>Shader-native effect components for React, rendered via WebGPU.</p>
        </div>

        <nav className="main-content-footer__nav" aria-label="Product">
          <h2>Product</h2>
          {PRODUCT_LINKS.map((link) => (
            <FooterLink href={link.href} onNavigate={onNavigate} key={link.href}>{link.label}</FooterLink>
          ))}
        </nav>

        <nav className="main-content-footer__nav" aria-label="Explore">
          <h2>Explore</h2>
          {EXPLORE_LINKS.map((link) => (
            <FooterLink href={link.href} onNavigate={onNavigate} key={link.href}>{link.label}</FooterLink>
          ))}
        </nav>

        <nav className="main-content-footer__nav" aria-label="Resources">
          <h2>More</h2>
          <a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt</a>
          <a href="/agents.md" target="_blank" rel="noreferrer">agents.md</a>
        </nav>
      </div>

      <div className="main-content-footer__meta">
        <span>© {new Date().getFullYear()} VFX UI</span>
        <span>React · WebGPU · WGSL</span>
      </div>
    </footer>
  );
}
