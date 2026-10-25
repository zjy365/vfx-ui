import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Shell } from "@/components/shell";
import { LiveExhibit } from "@/components/live-exhibit";
import { CopyButton } from "@/components/copy-button";
import { components } from "@/lib/catalog";

export default function Home() {
  const pick = (id: string) => components.find((item) => item.id === id)!;
  const command =
    "npx shadcn@latest add https://vfx-ui.com/r/fluid-gradient.json";
  return (
    <Shell>
      <main id="main" className="exhibit-home">
        <section
          className="exhibit-introduction exhibit-width"
          aria-labelledby="home-title"
        >
          <h1 id="home-title">
            React components.
            <br />
            Unexpected character.
          </h1>
          <div>
            <p>
              Shaders that move. Heroes that draw you in. Footers worth
              scrolling for.
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
              Pick a component, change the feel, and take the source. Use the
              registry, npm, or hand it to your AI agent.
            </p>
            <Link className="exhibit-link" href="/docs/installation/">
              Read the installation guide <ArrowRight size={16} />
            </Link>
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
