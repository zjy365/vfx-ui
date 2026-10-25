import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "@fontsource-variable/manrope";
import "@fontsource/dm-mono/400.css";
import "@fontsource-variable/bricolage-grotesque";
import "./global.css";
import "./motion.css";
import "./exhibit.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://vfx-ui.com"),
  title: {
    default: "VFX UI — React components. Unexpected character.",
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
