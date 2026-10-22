import Link from "next/link";
import { Shell } from "@/components/shell";
import { OpticalStage } from "@/components/optical-stage";
import { CopyButton } from "@/components/copy-button";
import { components, templates } from "@/lib/catalog";
export default function Home() {
  const hero = components.find((x) => x.id === "hero-contour")!;
  const footer = components.find((x) => x.id === "footer-vinyl")!;
  const command =
    "npx shadcn@latest add https://vfx-ui.com/r/hero-contour.json";
  return (
    <Shell>
      <main id="main">
        <section className="home-hero page-width">
          <div className="hero-copy">
            <p className="eyebrow status-dot">
              OPEN SOURCE COMPONENTS. COMPLETE PRO TEMPLATES.
            </p>
            <h1>
              Interfaces,
              <br />
              with a point
              <br />
              of view.
            </h1>
            <p className="hero-description">
              Shaders, expressive page sections, and the details that make a
              website feel like yours.
            </p>
            <div className="action-row">
              <Link className="button" href="/components/">
                Explore free components ↗
              </Link>
              <Link className="text-link" href="/templates/">
                See Pro templates
              </Link>
            </div>
          </div>
          <OpticalStage />
        </section>
        <section className="home-free page-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / THE FREE LIBRARY</p>
              <h2>
                A little more character.
                <br />A lot less starting over.
              </h2>
            </div>
            <Link className="text-link" href="/components/">
              Browse {components.filter((x) => x.visible).length} components ↗
            </Link>
          </div>
          <div className="featured-pair">
            {[hero, footer].map((item, i) => (
              <Link className="featured-card" key={item.id} href={item.path}>
                <div className={"featured-image " + (i ? "contain" : "")}>
                  <img
                    src={item.thumbnail}
                    alt={item.title + " preview"}
                    width={i ? 512 : 776}
                    height="300"
                    loading="lazy"
                  />
                </div>
                <div className="card-caption">
                  <span>{item.title}</span>
                  <span>{item.category} · Free ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="home-pro">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / THE PRO COLLECTION</p>
                <h2>
                  Five complete starting points.
                  <br />
                  Make one your own.
                </h2>
              </div>
              <div className="pro-intro">
                <p>
                  Full landing page projects built with VFX UI. Distinct
                  directions, responsive pages, and source you can make your
                  own.
                </p>
                <Link className="button yellow" href="/templates/">
                  Explore Pro templates ↗
                </Link>
              </div>
            </div>
            <div className="template-strip">
              {templates.map((item) => (
                <Link
                  key={item.id}
                  href={"/templates/" + item.id + "/"}
                  className={"mini-template theme-" + item.id}
                >
                  <div className="mini-art mini-cover">
                    <img
                      src={item.thumbnail}
                      alt={item.brand + " website preview"}
                      width="1440"
                      height="1000"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-caption">
                    <span>{item.title}</span>
                    <small>PRO ↗</small>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="agent-section page-width">
          <div>
            <p className="eyebrow">YOUR WORKFLOW, INCLUDED</p>
            <h2>
              Human taste.
              <br />
              Agent-ready delivery.
            </h2>
            <p>
              Preview it. Install the source. Keep building with your favorite
              AI coding tool.
            </p>
          </div>
          <div className="install-terminal">
            <div>
              <span className="eyebrow">INSTALL A COMPONENT</span>
              <CopyButton value={command} />
            </div>
            <pre>
              <code>
                npx shadcn@latest add
                <br />
                https://vfx-ui.com/r/hero-contour.json
              </code>
            </pre>
            <p>
              React + TypeScript <span>Your source</span> MIT licensed
            </p>
          </div>
        </section>
      </main>
    </Shell>
  );
}
