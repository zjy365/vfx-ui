import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Shell } from "@/components/shell";
import { LiveExhibit } from "@/components/live-exhibit";
import { CopyButton } from "@/components/copy-button";
import { components } from "@/lib/catalog";
import { StructuredData } from "@/components/structured-data";
import { homeTitle, homeDescription, pageMetadata, siteOrigin } from "@/lib/seo";

export const metadata = pageMetadata({ title: homeTitle, description: homeDescription, path: "/" });

export default function Home() {
  const pick = (id: string) => components.find((item) => item.id === id)!;
  const command =
    "npx shadcn@latest add https://vfx-ui.com/r/fluid-gradient.json";
  return (
    <Shell>
      <main id="main" className="exhibit-home">
        <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "VFX UI", url: siteOrigin + "/", description: homeDescription }} />
        <section
          className="exhibit-introduction exhibit-width"
          aria-labelledby="home-title"
        >
          <h1 id="home-title">
            Free React components.
            <br />
            Unexpected character.
          </h1>
          <div>
            <p>
              Animated backgrounds, hero sections and footers for React and Next.js.
              <br />
              Free, open source, and yours to shape.
            </p>
            <Link className="exhibit-link" href="/components/">
              Explore the library <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        <section
          className="exhibit-wall exhibit-width"
          aria-label="Explore live components"
        >
          <LiveExhibit />
          <div className="exhibit-sections">
            {[pick("hero-contour"), pick("footer-vinyl")].map((item) => (
              <Link
                key={item.id}
                href={item.path + "/"}
                className={"exhibit-section exhibit-" + item.id}
              >
                <div className="exhibit-section-image">
                  <img
                    src={item.thumbnail}
                    alt={item.title + " component preview"}
                    width={1120}
                    height={item.id === "footer-vinyl" ? 733 : 640}
                    fetchPriority="high"
                  />
                </div>
                <div className="exhibit-caption">
                  <span>{item.title}</span>
                  <span>
                    {item.category === "Footers" ? "Footer" : "Hero"}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section
          className="exhibit-selection exhibit-width"
          aria-labelledby="selection-title"
        >
          <div className="exhibit-section-heading">
            <h2 id="selection-title">Small details. Big difference.</h2>
            <Link className="exhibit-link" href="/components/">
              Browse all {components.filter((item) => item.visible).length}{" "}
              components <ArrowRight size={16} />
            </Link>
          </div>
          <div className="exhibit-picks">
            {[
              pick("hero-eclipse"),
              pick("spectral-card"),
              pick("iridescent"),
            ].map((item) => (
              <Link
                key={item.id}
                href={item.path + "/"}
                className="exhibit-pick"
                data-category={item.category}
              >
                <div className="exhibit-pick-image">
                  <img
                    src={item.thumbnail}
                    alt={item.title + " component preview"}
                    width={800}
                    height={450}
                    loading="lazy"
                  />
                </div>
                <div className="exhibit-caption">
                  <span>{item.title}</span>
                  <span>
                    {item.category === "Backgrounds"
                      ? "Shader"
                      : item.category === "Heroes"
                        ? "Hero"
                        : "Interaction"}
                    <ExternalLink size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section
          className="exhibit-source exhibit-width"
          aria-labelledby="source-title"
        >
          <div>
            <h2 id="source-title">Your code. Your canvas.</h2>
            <p>
              Start with a <Link href="/heroes/">React hero section</Link>, an{" "}
              <Link href="/backgrounds/">animated background</Link> or a{" "}
              <Link href="/footers/">footer component</Link>. Install editable
              source with the shadcn registry, then make it your own.
            </p>
            <Link className="exhibit-link" href="/docs/installation/">
              Read the installation guide <ArrowRight size={16} />
            </Link>
            <p>Need a starting point? Read our <Link href="/blog/">React UI guides and examples</Link>.</p>
          </div>
          <div className="exhibit-terminal">
            <div>
              <span>Install editable source</span>
              <CopyButton value={command} />
            </div>
            <pre>
              <code>
                npx shadcn@latest add
                <br />
                https://vfx-ui.com/r/fluid-gradient.json
              </code>
            </pre>
            <p>
              React + TypeScript <span>Open source</span> MIT
            </p>
          </div>
        </section>
      </main>
    </Shell>
  );
}
