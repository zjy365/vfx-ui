import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { TemplatePreview } from "@/components/template-preview";
import { ProOffer } from "@/components/pro-offer";
import { templates } from "@/lib/catalog";
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
  const item = templates.find((x) => x.id === id);
  return {
    title: item?.title + " Pro template",
    description: item?.description,
  };
}
export default async function Template({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = templates.find((x) => x.id === id);
  if (!item) notFound();
  return (
    <Shell>
      <main id="main" className="templates-page page-width">
        <div className="page-intro">
          <Link className="eyebrow" href="/templates/">
            ← PRO COLLECTION 01
          </Link>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
        </div>
        <div className="templates-layout">
          <div className={"template-detail theme-" + item.id}>
            <TemplatePreview
              title={item.brand}
              preview={item.preview}
              thumbnail={item.thumbnail}
            />
            <section className="detail-section">
              <h2>A complete starting point.</h2>
              <p>
                Designed for {item.category.toLowerCase()}. The project includes
                editable Next.js source, responsive page layouts, replaceable
                content and setup instructions.
              </p>
              <ul className="included-pages">
                {item.pages.map((page) => (
                  <li key={page}>{page}</li>
                ))}
              </ul>
              <p className="license-note">
                Browse the complete live website above. The source archive is
                delivered privately after purchase. Contact forms and service
                integrations require your own configuration.
              </p>
            </section>
          </div>
          <ProOffer />
        </div>
      </main>
    </Shell>
  );
}
