"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Github,
  Menu,
  X,
} from "lucide-react";
import styles from "./site-header.module.css";

const links = [
  {
    href: "/components/",
    label: "Components",
    description: "Free effects, heroes, footers & more",
    pro: false,
  },
  {
    href: "/docs/",
    label: "Docs",
    description: "Installation, guides & API reference",
    pro: false,
  },
  {
    href: "/templates/",
    label: "Templates",
    description: "Complete projects to make your own",
    pro: true,
  },
];
const componentSections = [
  "components",
  "heroes",
  "footers",
  "backgrounds",
  "interactions",
  "text",
  "glass",
  "blocks",
  "preview",
  "examples",
];
function current(href: string, pathname: string) {
  const section = href.replace(/\/$/, "");
  return href === "/components/"
    ? componentSections.includes(pathname.split("/")[1])
    : pathname === section || pathname.startsWith(section + "/");
}
export function HeaderNavigation() {
  const pathname = usePathname();
  return (
    <nav className={styles.navigation} aria-label="Main navigation">
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={current(link.href, pathname) ? "page" : undefined}
            >
              {link.label}
              {link.pro && <span className={styles.proBadge}>Pro</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export function MobileNavigation({ accountUrl = "" }: { accountUrl?: string }) {
  const pathname = usePathname();
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  useEffect(() => {
    if (details.current) details.current.open = false;
  }, [pathname]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (
        details.current?.open &&
        event.target instanceof Node &&
        !details.current.contains(event.target)
      )
        details.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <details
      className={styles.mobileMenu}
      ref={details}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false;
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && details.current?.open) {
          event.preventDefault();
          details.current.open = false;
          summary.current?.focus();
        }
      }}
    >
      <summary ref={summary} aria-label="Toggle navigation">
        <span className={styles.menuOpen}>Menu</span>
        <span className={styles.menuClose}>Close</span>
        <Menu className={styles.menuOpen} size={18} aria-hidden="true" />
        <X className={styles.menuClose} size={18} aria-hidden="true" />
      </summary>
      <nav
        aria-label="Mobile navigation"
        onClick={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("a") &&
            details.current
          )
            details.current.open = false;
        }}
      >
        <p className={styles.menuEyebrow}>Explore VFX UI</p>
        <ul className={styles.mobileLinks}>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current(link.href, pathname) ? "page" : undefined}
              >
                <span className={styles.linkCopy}>
                  <span className={styles.linkTitle}>
                    {link.label === "Docs" ? "Documentation" : link.label}
                    {link.pro && <span className={styles.proBadge}>Pro</span>}
                  </span>
                  <span className={styles.linkDescription}>{link.description}</span>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.resources}>
          <a href="https://github.com/zjy365/vfx-ui">
            <Github size={17} aria-hidden="true" />
            GitHub
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          {accountUrl && (
            <a href={`${accountUrl}/sign-in?next=%2Fpurchases`}>
              Sign in
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
        <Link className={styles.startLink} href="/docs/installation/">
          Get started
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </nav>
    </details>
  );
}
