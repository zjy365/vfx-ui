import { Shell } from "@/components/shell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({ title: "Privacy", description: "How the free VFX UI website handles public library browsing, local preview controls, request information and links to external services.", path: "/privacy/" });
export default function Privacy() {
  return (
    <Shell>
      <main id="main" className="prose-page page-width">
        <p className="eyebrow">FREE COMPONENT LIBRARY</p>
        <h1>Privacy</h1>
        <p>
          The public VFX UI library can be browsed without an account. Component
          search, filters and preview changes run in your browser.
        </p>
        <h2>Website delivery</h2>
        <p>
          Our hosting provider processes request information, such as IP
          addresses and browser details, to deliver and secure the website.
          Links to GitHub and external services are governed by those services’
          policies.
        </p>
        <h2>Browsing without an account</h2>
        <p>
          This website does not offer account registration or collect payments.
          You do not need to provide an email address to browse the library or
          copy component source.
        </p>
        <h2>Website analytics</h2>
        <p>
          We use our self-hosted Rybbit service at stats.lzgpt.top to measure
          page visits, navigation and interactions such as installation and
          code-copy button clicks. Rybbit stores a visitor identifier in your
          browser. Its current tracking configuration also enables session
          replay, error reporting and form interaction tracking.
        </p>
        <p>
          Button events identify the action and, where relevant, the component.
          These event properties do not include the code being copied.
          Page addresses, including shared settings in URL parameters, may
          appear in analytics.
        </p>
        <h2>Local controls</h2>
        <p>
          Component settings and searches run in your browser. A shared component
          URL can include the settings you chose; review its contents before
          sharing it with another person.
        </p>
        <h2>Preview isolation</h2>
        <p>
          Interactive examples load in same-origin isolated frames. Example
          controls do not submit your content to an AI service.
        </p>
      </main>
    </Shell>
  );
}
