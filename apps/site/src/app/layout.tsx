import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "@fontsource-variable/manrope";
import "@fontsource/dm-mono/400.css";
import "./global.css";
import "./motion.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://vfx-ui.com"),
  title: {
    default: "VFX UI — Interfaces, with a point of view.",
    template: "%s · VFX UI",
  },
  description:
    "Free, open source React components. Shaders, expressive headers and footers, and complete Pro landing page templates.",
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
      </body>
    </html>
  );
}
