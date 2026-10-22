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
        nav={{ title: <span className="wordmark">✳ vfx/ui</span> }}
        links={[
          { text: "Components", url: "/components/" },
          { text: "Pro templates", url: "/templates/" },
        ]}
        themeSwitch={{ enabled: false }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
