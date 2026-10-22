import Link from "next/link";
import { Shell } from "@/components/shell";
import { ProOffer } from "@/components/pro-offer";
import { templates } from "@/lib/catalog";
export const metadata = {
  title: "Pro landing page templates",
  description:
    "Five original landing page projects, one Pro collection. Agency, Marketing, Playful, SaaS and Startup.",
};
export default function Templates() {
  return (
    <Shell>
      <main id="main" className="templates-page page-width">
        <div className="page-intro template-intro">
          <div>
            <p className="eyebrow">VFX UI PRO / COLLECTION 01</p>
            <h1>
              A whole website.
              <br />A head start.
            </h1>
          </div>
          <p>
            Five original landing page projects. Choose a direction, change the
            content, ship your own.
          </p>
        </div>
        <div className="templates-layout">
          <div className="template-list">
            {templates.map((item) => (
              <article
                key={item.id}
                className={"template-card theme-" + item.id}
              >
                <Link href={"/templates/" + item.id + "/"}>
                  <div className="template-cover">
                    <img
                      src={item.thumbnail}
                      alt={item.brand + " website preview"}
                      width="1440"
                      height="1000"
                      loading="lazy"
                    />
                    <span className="gallery-play">Explore template ↗</span>
                  </div>
                </Link>
                <div className="card-caption">
                  <h2>{item.title}</h2>
                  <span>PRO · LIVE PREVIEW</span>
                </div>
                <p>{item.description}</p>
                <div className="template-pages">
                  {item.pages.map((page) => (
                    <span key={page}>{page}</span>
                  ))}
                </div>
                <Link
                  className="text-link"
                  href={"/templates/" + item.id + "/"}
                >
                  Explore this template ↗
                </Link>
              </article>
            ))}
          </div>
          <ProOffer />
        </div>
        <section className="product-faq">
          <h2>A few useful details.</h2>
          {[
            [
              "Are the free components still free?",
              "Yes. The free library stays MIT licensed. Pro sells complete landing page projects, and does not lock previously published free components.",
            ],
            [
              "Do I need a subscription?",
              "No. Collection 01 is a one-time purchase. It includes 12 months of updates to these five projects; versions you receive remain yours to use afterward.",
            ],
            [
              "Can I build client websites?",
              "Yes, under the solo license one user can build unlimited personal and client end products. Reselling templates or redistributing the collection source is not allowed.",
            ],
            [
              "Does this include authentication and payments?",
              "The product is a landing page template collection. Any account, payment or contact UI needs your own service configuration; a hosted SaaS backend is not included.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
    </Shell>
  );
}
