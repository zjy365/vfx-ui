import { ArrowRight, Code2, Database, FolderOpen, Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { ProOffer } from "@/components/pro-offer";
import { TemplateCard } from "@/components/template-preview";
import { ProProductSelector } from "@/components/pro-product-selector";
import { accountUrl, templates, product } from "@/lib/catalog";
import styles from "@/components/pro-storefront.module.css";
import { notFound } from "next/navigation";
import { PRO_PUBLISHED } from "../../../../../catalog/publication.mjs";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbs, collectionData, pageMetadata, templateTitle } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Next.js Website & SaaS Templates",
  description:
    "Explore editable Next.js templates for agencies, marketing, research and SaaS products. Compare page previews, source contents and setup requirements.",
  path: "/templates/",
});

export default function Templates() {
  if (!PRO_PUBLISHED) notFound();
  return (
    <Shell>
      <main id="main" className={styles.page}>
        <StructuredData data={[
          breadcrumbs([{ name: "Next.js templates", path: "/templates/" }]),
          collectionData("Next.js Website & SaaS Templates", "Editable Next.js project source and previews.", "/templates/", templates.map(item => ({ title: templateTitle(item), path: `/templates/${item.id}/` }))),
        ]} />
        <div className={styles.width}>
          <section
            className={styles.productIntro}
            aria-labelledby="collection-title"
          >
            <h1 id="collection-title">
              Next.js templates.
              <br />
              With a working foundation.
            </h1>
            <div>
              <p>
                Six editable Next.js projects, from homepage to private
                workspace.
              </p>
              {accountUrl && (
                <a href={`${accountUrl}/purchases`}>
                  Your account & downloads{" "}
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </section>
          <ProProductSelector />
          <section
            className={styles.productIncluded}
            aria-labelledby="included-heading"
          >
            <h2 id="included-heading">A website is just the beginning.</h2>
            <div>
              <Code2 size={21} aria-hidden="true" />
              <h3>Make the source yours.</h3>
              <p>
                Responsive pages, components and content you can edit, with
                setup instructions for your own deployment.
              </p>
            </div>
            <div>
              <Database size={21} aria-hidden="true" />
              <h3>Build behind the homepage.</h3>
              <p>
                Better Auth accounts, PostgreSQL and Drizzle form the foundation
                for each private workspace.
              </p>
            </div>
            <div>
              <FolderOpen size={21} aria-hidden="true" />
              <h3>Keep building on it.</h3>
              <p>
                Lifetime updates follow your purchase. Your account keeps your
                licenses and available source downloads together.
              </p>
            </div>
          </section>
          <section
            id="collection"
            className={styles.collection}
            aria-labelledby="templates-title"
          >
            <div className={styles.collectionHeading}>
              <h2 id="templates-title">Find the foundation that fits.</h2>
              <p>{templates.length} complete project directions</p>
            </div>
            <div className={styles.directoryGrid}>
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </section>
        </div>
        <ProOffer />
        <div className={styles.width}>
          <section className={styles.faq} aria-labelledby="faq-title">
            <h2 id="faq-title">Before you start.</h2>
            {[
              [
                "What happens after I choose Pro Lifetime?",
                "Sign in with your email or an available social provider, review your Pro Lifetime license and complete checkout when it is ready. Confirmed purchases and available versioned source downloads appear in your account.",
              ],
              [
                "Can I use these for client work?",
                "Yes. One user can build unlimited personal, commercial and client end products. You may hand over a finished client project with the source needed to maintain it. Template resale and redistribution of the collection are excluded.",
              ],
              [
                "What do I need to run a project?",
                "A Node.js environment, PostgreSQL and the template’s environment settings. Connect the external email, payment, AI or deployment services your product needs. Hosted services and business payment processing are not included.",
              ],
              [
                "Is this a subscription?",
                `No. Pro Lifetime is $${product.price} USD once for all current and future Pro templates, with lifetime use and source updates. Separately sold skills and hosted services are excluded.`,
              ],
              [
                "Are the free components still free?",
                "Yes. The VFX UI library remains MIT licensed. Pro is a separate collection of complete application source projects.",
              ],
            ].map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus size={18} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </main>
    </Shell>
  );
}
