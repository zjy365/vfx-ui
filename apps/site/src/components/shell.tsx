import Link from "next/link";
import { ThemeToggle } from "./theme-provider";
import { accountUrl } from "@/lib/catalog";
export function Header() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="VFX UI home">
        <span aria-hidden>✳</span> vfx/ui
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/components/">Components</Link>
        <Link href="/templates/">
          Templates <small>PRO</small>
        </Link>
        <Link href="/docs/">Docs</Link>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <a href="https://github.com/zjy365/vfx-ui">GitHub ↗</a>
        <Link
          className="button button-outline"
          href={accountUrl || "/docs/installation/"}
        >
          {accountUrl ? "My purchases" : "Get started ↗"}
        </Link>
      </div>
      <div className="mobile-theme">
        <ThemeToggle />
      </div>
      <details className="mobile-menu">
        <summary aria-label="Open navigation">Menu ☰</summary>
        <nav aria-label="Mobile navigation">
          <Link href="/components/">Components</Link>
          <Link href="/templates/">Pro templates</Link>
          <Link href="/docs/">Documentation</Link>
          <a href="https://github.com/zjy365/vfx-ui">GitHub ↗</a>
          {accountUrl && <a href={accountUrl}>My purchases</a>}
        </nav>
      </details>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <h2>
          Good interfaces
          <br />
          leave an impression.
        </h2>
        <div className="footer-links">
          <div>
            <span className="eyebrow">EXPLORE</span>
            <Link href="/components/">Free components</Link>
            <Link href="/templates/">Pro templates</Link>
            <Link href="/docs/">Documentation</Link>
          </div>
          <div>
            <span className="eyebrow">ELSEWHERE</span>
            <a href="https://github.com/zjy365/vfx-ui">GitHub ↗</a>
            <a href="/llms.txt">For AI agents ↗</a>
            <Link href="/docs/license/">License</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <Link href="/" className="wordmark">
          ✳ vfx/ui
        </Link>
        <span>© {new Date().getFullYear()} VFX UI</span>
        <div>
          <Link href="/privacy/">Privacy</Link>
          <Link href="/terms/">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
