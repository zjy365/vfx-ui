import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Shell } from "@/components/shell";
import { TemplateCard, TemplatePreview } from "@/components/template-preview";
import { ProOffer } from "@/components/pro-offer";
import { templateSummary } from "@/components/pro-storefront";
import { templates } from "@/lib/catalog";
import styles from "@/components/pro-storefront.module.css";

export function generateStaticParams() {
  return templates.map(({ id }) => ({ id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = templates.find((template) => template.id === id);
  return {
    title: item
      ? `${item.brand} · ${item.title} Pro template`
      : "Template not found",
    description: item?.description,
  };
}

export default async function Template({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = templates.find((template) => template.id === id);
  if (!item) notFound();
  const related = templates
    .filter((template) => template.id !== id)
    .slice(0, 2);
  return (
    <Shell>
      <main id="main" className={`${styles.page} ${styles.width}`}>
        <Link className={styles.backLink} href="/templates/">
          <ArrowLeft size={16} aria-hidden="true" /> All templates
        </Link>
        <section className={styles.templateDetailTop}>
          <div>
            <h1>{item.brand}</h1>
            <p>
              {item.title} template · {item.category}
            </p>
          </div>
          <p>{templateSummary(item)}</p>
        </section>
        <div className={styles.detailPurchaseGrid}>
          <TemplatePreview template={item} />
          <ProOffer template={item} />
        </div>
        <div className={styles.detailSections}>
          <section aria-labelledby="included-title">
            <h2 id="included-title">What’s inside.</h2>
            <p>{item.description}</p>
            <ul className={styles.pageList}>
              {item.pages.map((page) => (
                <li key={page}>
                  <Check size={16} aria-hidden="true" />
                  {page}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="setup-title">
            <h2 id="setup-title">Make it your own.</h2>
            <dl className={styles.requirements}>
              <div>
                <dt>Framework</dt>
                <dd>Next.js and React</dd>
              </div>
              <div>
                <dt>Accounts</dt>
                <dd>Better Auth</dd>
              </div>
              <div>
                <dt>Database</dt>
                <dd>PostgreSQL and Drizzle</dd>
              </div>
              <div>
                <dt>Deployment</dt>
                <dd>Your server and database</dd>
              </div>
            </dl>
            <p className={styles.setupNote}>
              Replace the demo copy and branding, configure your environment,
              and connect the external services your product needs. AI
              execution, payment processing and hosting infrastructure are not
              included.
            </p>
          </section>
        </div>
        <section className={styles.related} aria-labelledby="related-title">
          <h2 id="related-title">Another direction?</h2>
          <div className={styles.templateGrid}>
            {related.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      </main>
    </Shell>
  );
}
