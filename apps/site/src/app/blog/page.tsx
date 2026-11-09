import Link from "next/link";
import { Shell } from "@/components/shell";
import { StructuredData } from "@/components/structured-data";
import { blogSource } from "@/lib/blog";
import { breadcrumbs, collectionData, pageMetadata } from "@/lib/seo";
import "./blog.css";
import { PRO_PUBLISHED } from "../../../../../catalog/publication.mjs";

const title = "React UI Guides & Component Articles";
const description = "Practical guides to React hero sections, WebGPU backgrounds and UI libraries, with editable examples and installation instructions.";
export const metadata = pageMetadata({ title, description, path: "/blog/" });

export default function Blog() {
  const pages = blogSource.getPages();
  return (
    <Shell>
      <main id="main" className="blog-page page-width">
        <StructuredData data={[
          breadcrumbs([{ name: "Articles", path: "/blog/" }]),
          collectionData(title, description, "/blog/", pages.map(page => ({ title: page.data.title, path: page.url }))),
        ]} />
        <header className="blog-intro">
          <p className="eyebrow">VFX UI ARTICLES</p>
          <h1>React UI guides & examples.</h1>
          <p>React UI guides, editable examples and the decisions behind a useful website.</p>
        </header>
        <div className="blog-list">
          {pages.map(page => (
            <article key={page.url}>
              <h2><Link href={page.url + "/"}>{page.data.title}</Link></h2>
              <p>{page.data.description}</p>
              <Link href={page.url + "/"}>Read the guide</Link>
            </article>
          ))}
        </div>
        <nav className="topic-links" aria-label="Start building">
          <Link href="/components/">Browse free React components</Link>
          <Link href="/docs/installation/">Install editable source</Link>
          {PRO_PUBLISHED && <Link href="/templates/">Explore Next.js templates</Link>}
        </nav>
      </main>
    </Shell>
  );
}
