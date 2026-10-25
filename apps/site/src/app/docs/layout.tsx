import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./docs.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider
      theme={{ enabled: false }}
      search={{ options: { type: "static", api: "/search-index.json" } }}
    >
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <span className="docs-brand">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />
              </svg>
              vfx/ui <span>Docs</span>
            </span>
          ),
        }}
        links={[
          { text: "Browse components", url: "/components/" },
        ]}
        themeSwitch={{ enabled: true }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
