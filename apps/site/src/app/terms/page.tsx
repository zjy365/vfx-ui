import Link from "next/link";
import { Shell } from "@/components/shell";
export const metadata = { title: "Terms" };
export default function Terms() {
  return (
    <Shell>
      <main id="main" className="prose-page page-width">
        <p className="eyebrow">LAST UPDATED / OCTOBER 22, 2026</p>
        <h1>Terms</h1>
        <h2>Open source library</h2>
        <p>
          Free library source is provided under MIT, including its warranty
          disclaimer. Review the source and test compatibility before using it
          in your product.
        </p>
        <h2>Pro collection</h2>
        <p>
          Pro is a separate commercial source license for complete landing page
          projects. The product page identifies availability, included projects,
          price and update period. No payment is collected while a collection is
          unavailable.
        </p>
        <p>
          Read the <Link href="/docs/license/">license</Link> for permitted use,
          client projects and source redistribution restrictions. Terms
          presented at checkout govern a purchase.
        </p>
        <h2>Service integrations</h2>
        <p>
          Template setup may require your own hosting, account, email, analytics
          or payment providers. Those services and their costs are not included
          unless explicitly stated.
        </p>
        <h2>Purchase support</h2>
        <p>
          The live store will provide a support contact, refund terms and seller
          details before accepting orders. Applicable statutory consumer rights
          remain unaffected.
        </p>
      </main>
    </Shell>
  );
}
