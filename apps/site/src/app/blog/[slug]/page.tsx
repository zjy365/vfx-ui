import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/shell";
import { StructuredData } from "@/components/structured-data";
import { blogSource } from "@/lib/blog";
import { breadcrumbs, canonicalUrl, pageMetadata } from "@/lib/seo";
import "../blog.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return blogSource.getPages().map(page => ({ slug: page.slugs[0] }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();
  return pageMetadata({ title: page.data.title, description: page.data.description || "A practical VFX UI guide for React developers.", path: page.url });
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();
  const MDX = page.data.body;
  const related = blogSource.getPages().filter(item => item.url !== page.url);
  return (
    <Shell>
      <main id="main" className="blog-page page-width">
        <StructuredData data={[
          breadcrumbs([{ name: "Articles", path: "/blog/" }, { name: page.data.title, path: page.url }]),
          {
            "@context": "https://schema.org", "@type": "Article",
            headline: page.data.title, description: page.data.description,
            url: canonicalUrl(page.url), mainEntityOfPage: canonicalUrl(page.url),
            author: { "@type": "Organization", name: "VFX UI", url: "https://vfx-ui.com/" },
            inLanguage: "en",
          },
        ]} />
        <article>
          <header className="blog-intro">
            <Link href="/blog/">All articles</Link>
            <h1>{page.data.title}</h1>
            <p>{page.data.description}</p>
            <p className="blog-byline">Written by VFX UI</p>
          </header>
          <nav className="blog-toc" aria-label="In this article">
            <h2>In this article</h2>
            <ul>{page.data.toc.filter(entry => entry.depth === 2).map(entry => <li key={entry.url}><a href={entry.url}>{entry.title}</a></li>)}</ul>
          </nav>
          <div className="blog-body"><MDX /></div>
        </article>
        <aside className="blog-related" aria-labelledby="related-articles">
          <h2 id="related-articles">Keep reading</h2>
          <ul>{related.map(item => <li key={item.url}><Link href={item.url + "/"}>{item.data.title}</Link></li>)}</ul>
        </aside>
      </main>
    </Shell>
  );
}
