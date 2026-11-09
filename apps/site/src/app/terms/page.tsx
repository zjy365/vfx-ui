import Link from "next/link";
import { Shell } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Terms", description: "Terms for the free VFX UI React component library: MIT licensing, source notices, browser compatibility and external service requirements.", path: "/terms/" });
export default function Terms() {
  return (
    <Shell>
      <main id="main" className="prose-page page-width">
        <p className="eyebrow">FREE COMPONENT LIBRARY</p>
        <h1>Terms</h1>
        <h2>Open source library</h2>
        <p>
          Free library source is provided under MIT, including its warranty
          disclaimer. Review the source and test compatibility before using it
          in your product.
        </p>
        <h2>Use and redistribution</h2>
        <p>
          You may adapt the free components for personal, commercial and client
          projects under their applicable licenses. Retain copyright and license
          notices when redistributing source.
        </p>
        <p>
          Read the <Link href="/docs/license/">license guide</Link> and the full
          license supplied with the source you use.
        </p>
        <h2>Service integrations</h2>
        <p>
          Your project may require its own hosting or third-party services.
          Installing a component does not provide those services or cover their
          costs. External websites have their own terms and policies.
        </p>
        <h2>Example content</h2>
        <p>
          Replace fictional demonstration copy, prices, links and testimonials
          before publishing your own website. The free library does not collect
          payments or sell services through its example components.
        </p>
      </main>
    </Shell>
  );
}
