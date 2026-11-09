import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/shell";
import { ComponentDetail } from "@/components/component-detail";
import { Catalog } from "@/components/catalog";
import { components, categories } from "@/lib/catalog";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbs, canonicalUrl, categoryContent, collectionData, componentTitle, pageMetadata, routeSegment as segment, siteOrigin } from "@/lib/seo";
const tags = [...new Set(components.flatMap((x) => x.tags))];
function selection(path: string) {
  for (const item of components) {
    if (item.path === path) return { item };
    const variant = item.variants?.find((v) => item.path + "/" + v.id === path);
    if (variant) return { item, variant };
  }
  return null;
}
export function generateStaticParams() {
  return [
    ...components.flatMap((item) => [
      { slug: item.path.slice(1).split("/") },
      ...(item.variants || []).map((v) => ({
        slug: [...item.path.slice(1).split("/"), v.id],
      })),
    ]),
    ...categories.map((x) => ({ slug: [segment(x)] })),
    ...tags.map((x) => ({ slug: ["components", "tag", segment(x)] })),
  ];
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const selected = selection("/" + slug.join("/"));
  if (selected) return pageMetadata({
    title: componentTitle(selected.item),
    description: selected.item.description,
    // Presets share a component's search intent and consolidate to its main page.
    path: selected.item.path,
    image: selected.item.thumbnail,
  });
  const category = categories.find(x => segment(x) === slug[0] && slug.length === 1);
  const tag = slug.length === 3 && slug[0] === "components" && slug[1] === "tag"
    ? tags.find(x => segment(x) === slug[2]) : undefined;
  if (category) return pageMetadata({ ...categoryContent[category], path: `/${segment(category)}/` });
  if (tag) return pageMetadata({
    title: `${tag} React components`,
    description: `Browse React components tagged ${tag}. Preview the designs and install editable source.`,
    path: `/components/tag/${segment(tag)}/`,
    // Uncurated filter combinations are navigation aids, not search landing pages.
    index: false,
  });
  notFound();
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const selected = selection(path);
  const category = categories.find(
    (x) => segment(x) === slug[0] && slug.length === 1,
  );
  const tag =
    slug.length === 3 && slug[0] === "components" && slug[1] === "tag"
      ? tags.find((x) => segment(x) === slug[2])
      : undefined;
  if (!selected && !category && !tag) notFound();
  return (
    <>
      <Header />
      {selected ? (
        <div className="component-product page-width">
          <main id="main" className="component-detail">
            <StructuredData data={[
              breadcrumbs([
                { name: "Free React components", path: "/components/" },
                { name: selected.item.category, path: `/${segment(selected.item.category)}/` },
                { name: selected.item.title, path: selected.item.path },
              ]),
              {
                "@context": "https://schema.org", "@type": "SoftwareSourceCode",
                name: componentTitle(selected.item), description: selected.item.description,
                url: canonicalUrl(selected.item.path), image: new URL(selected.item.thumbnail, siteOrigin).href,
                programmingLanguage: selected.item.runtime === "webgpu" ? ["TypeScript", "WGSL"] : ["TypeScript"],
                codeSampleType: "full", license: "https://opensource.org/license/mit",
              },
            ]} />
            <p className="eyebrow breadcrumb">
              <Link href="/components/">← THE FREE LIBRARY</Link> /{" "}
              <Link href={"/" + segment(selected.item.category) + "/"}>
                {selected.item.category.toUpperCase()}
              </Link>{" "}
              / FREE · MIT
            </p>
            <ComponentDetail
              key={selected.item.id + ":" + (selected.variant?.id || "default")}
              item={selected.item}
              variantId={selected.variant?.id}
              heading={componentTitle(selected.item)}
            />
            <nav className="topic-links" aria-label="Component guides">
              <Link href="/docs/installation/">Install in React or Next.js</Link>
              <Link href="/docs/accessibility/">Browser support and accessibility</Link>
              <Link href={`/${segment(selected.item.category)}/`}>More {selected.item.category.toLowerCase()}</Link>
            </nav>
          </main>
        </div>
      ) : (
        <main id="main" className="catalog-page page-width">
          {category && <StructuredData data={[
            breadcrumbs([{ name: "Free React components", path: "/components/" }, { name: category, path }]),
            collectionData(categoryContent[category].title, categoryContent[category].description, path, components.filter(item => item.visible && item.category === category)),
          ]} />}
          <div className="page-intro">
            <p className="eyebrow">THE FREE LIBRARY</p>
            <h1>{category ? categoryContent[category].title : `${tag} React components`}</h1>
            <p>{category ? categoryContent[category].description : "Editable React components, free for commercial projects."}</p>
            <nav className="topic-links" aria-label="Collection guides">
              <Link href="/components/">All React components</Link>
              <Link href="/docs/installation/">Installation guide</Link>
              <Link href="/docs/accessibility/">Compatibility and accessibility</Link>
            </nav>
          </div>
          <Catalog
            key={category || tag || "all"}
            initialCategory={category}
            initialQuery={tag}
            items={components
              .filter((x) => x.visible)
              .map(
                ({
                  id,
                  title,
                  description,
                  category,
                  path,
                  thumbnail,
                  tags,
                  runtime,
                }) => ({
                  id,
                  title,
                  description,
                  category,
                  path,
                  thumbnail,
                  tags,
                  runtime,
                }),
              )}
          />
        </main>
      )}
      <Footer />
    </>
  );
}
