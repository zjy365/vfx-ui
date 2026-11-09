import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { homeTitle, homeDescription, siteOrigin } from "@/lib/seo";
import "@fontsource-variable/manrope";
import "@fontsource/dm-mono/400.css";
import "@fontsource-variable/bricolage-grotesque";
import "./global.css";
import "./motion.css";
import "./exhibit.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: `${homeTitle} · VFX UI`,
    template: "%s · VFX UI",
  },
  description: homeDescription,
  openGraph: { type: "website", images: ["/og-cover.png"] },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
        <Script
          id="vfx-rybbit"
          src="https://stats.lzgpt.top/api/script.js?siteId=5"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
