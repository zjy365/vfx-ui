import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { accountUrl, product, templates, type Template } from "@/lib/catalog";
import { canPurchase } from "./pro-storefront";
import styles from "./pro-storefront.module.css";

export function ProOffer({ template }: { template?: Template }) {
  if (!template) return <CollectionPricing />;
  const available = canPurchase(product.status);
  return (
    <aside
      className={styles.offer}
      aria-label={`${template.brand} included in Pro Lifetime`}
    >
      <h2 className={styles.offerScope}>Pro Lifetime</h2>
      <p className={styles.price}>
        ${product.price}
        <span>USD · one payment</span>
      </p>
      {accountUrl ? (
        <a
          className={styles.selectorCta}
          href={`${accountUrl}/buy/${product.id}`}
        >
          Get Pro Lifetime · ${product.price}
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      ) : (
        <p className={styles.selectorUnavailable}>
          Purchases open when the account service is connected.
        </p>
      )}
      <ul className={styles.offerFeatures}>
        {[
          `All ${templates.length} templates + future Pro releases`,
          "Lifetime use and source updates",
          "Unlimited personal and client projects",
          "Single-user commercial license",
        ].map((feature) => (
          <li key={feature}>
            <Check size={16} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      {!available && (
        <div className={styles.availability}>
          <strong>Source delivery is being prepared</strong>
          <p>
            You can review your license and sign in. Checkout opens when the
            collection release and delivery services are ready.
          </p>
        </div>
      )}
      <p className={styles.smallPrint}>
        Configure and host your own services. Third-party service fees are
        separate.
      </p>
      <div className={styles.offerLinks}>
        {accountUrl && (
          <a href={`${accountUrl}/purchases`}>
            My purchases & downloads
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
        <Link href="/docs/license/">
          Read the license
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/templates/#collection">
          Explore all included templates
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

function CollectionPricing() {
  const available = canPurchase(product.status);
  return (
    <section
      id="pricing"
      className={styles.pricingSection}
      aria-labelledby="pricing-title"
    >
      <div className={styles.pricingInner}>
        <div className={styles.pricingIntro}>
          <h2 id="pricing-title">
            Every template.
            <br />
            One lifetime license.
          </h2>
          <p>
            One payment. Keep what you build.
            <br />
            For personal projects and client work.
          </p>
          <Link href="/docs/license/" className={styles.inlineLink}>
            Single-user commercial license
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          {accountUrl && (
            <a href={`${accountUrl}/purchases`} className={styles.inlineLink}>
              My purchases & downloads
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className={`${styles.pricingOptions} ${styles.bundlePricing}`}>
          <div className={styles.pricingOption}>
            <h3>Pro Lifetime</h3>
            <p className={styles.price}>
              ${product.price}
              <span>USD once</span>
            </p>
            <ul>
              <li>
                All {templates.length} templates, plus future Pro releases
              </li>
              <li>Lifetime use and source updates</li>
              <li>Unlimited personal and client projects</li>
            </ul>
            {accountUrl ? (
              <a
                href={`${accountUrl}/buy/${product.id}`}
                className={styles.selectorCta}
              >
                Get Pro Lifetime · ${product.price}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <p className={styles.pricingStatus}>Collection in development</p>
            )}
            {!available && (
              <p className={styles.selectorNote}>
                Source delivery is being prepared. Checkout opens when the
                collection and delivery services are ready.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
