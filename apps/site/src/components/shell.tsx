import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { ThemeToggle } from "./theme-provider";
import { HeaderNavigation, MobileNavigation } from "./header-navigation";
import { accountUrl } from "@/lib/catalog";
import styles from "./site-header.module.css";
function Mark() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />
    </svg>
  );
}
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.navigationGroup}>
          <Link className={styles.brand} href="/" aria-label="VFX UI home">
            <Mark />
            vfx/ui
          </Link>
          <HeaderNavigation />
        </div>
        <div className={styles.actions}>
          {accountUrl && (
            <a className={styles.accountLink} href={`${accountUrl}/sign-in?next=%2Fpurchases`}>
              Sign in
            </a>
          )}
          <a
            className={styles.githubLink}
            href="https://github.com/zjy365/vfx-ui"
            aria-label="VFX UI on GitHub"
          >
            <Github size={18} aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <span className={styles.divider} aria-hidden="true" />
          <ThemeToggle />
          <Link className={styles.startLink} href="/docs/installation/">
            Get started <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.mobileTheme}>
          <ThemeToggle />
        </div>
        <MobileNavigation accountUrl={accountUrl} />
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="exhibit-footer exhibit-width">
      <div>
        <Link href="/" className="wordmark">
          <Mark />
          vfx/ui
        </Link>
        <span>Made for a more expressive web.</span>
      </div>
      <nav aria-label="Footer navigation">
        <a href="https://github.com/zjy365/vfx-ui">GitHub</a>
        <Link href="/docs/">Documentation</Link>
        <a href="/llms.txt">For AI agents</a>
        <Link href="/privacy/">Privacy</Link>
        <Link href="/terms/">Terms</Link>
      </nav>
      <p>
        © {new Date().getFullYear()} VFX UI{" "}
        <Link href="/docs/license/">Free components · MIT</Link>
      </p>
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
