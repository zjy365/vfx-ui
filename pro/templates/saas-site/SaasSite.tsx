"use client";

import type { CSSProperties } from "react";
import {
  BlockComparison,
  BlockContact,
  BlockFeatureGrid,
  BlockLogos,
  BlockNav,
  BlockNewsletter,
  BlockTestimonials,
  FooterTidal,
  HeroAuroraEditorial,
} from "@vfx-ui/react";

/**
 * Pro template — SaaS marketing site (fictional product "Cartogram", a
 * customer-journey analytics platform). Light, editorial, serif headlines:
 * an aurora masthead opens the page and a copper tide closes it. Every
 * string is demo content, marked visibly at the top of the screen.
 */
export default function SaasSite({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div id="cartogram-top" className={`vfx-pro-saas${className ? ` ${className}` : ""}`} style={style}>
      <style>{`
.vfx-pro-saas{background:#f7f7f2;color:#22251f;font-family:"Geist","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;container-type:inline-size}
.vfx-pro-saas *{box-sizing:border-box}.vfx-pro-saas [id]{scroll-margin-top:88px}.vfx-pro-saas a{color:inherit;text-decoration:none}
.vfx-pro-saas .vfx-block-title,.vfx-pro-saas .vfx-cta-title{font-family:Georgia,"Iowan Old Style","Times New Roman",serif;font-weight:500;letter-spacing:-.03em}
.vfx-pro-saas .vfx-saas-demo{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:10px 24px;border-bottom:1px solid #6d5ae026;background:#6d5ae00f;font:10px/1.6 ui-monospace,monospace;letter-spacing:.05em;color:#5d5680}
.vfx-pro-saas .vfx-saas-demo b{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border:1px solid #6d5ae059;border-radius:4px;background:#6d5ae01c;color:#5548c9;font-weight:500;letter-spacing:.14em}
@container(max-width:760px){.vfx-pro-saas .vfx-saas-demo{padding:12px 16px;text-align:center}}
      `}</style>

      {/* Visible demo labeling — the screen-top marker required by Pro templates. */}
      <p className="vfx-saas-demo" role="note">
        <b>PRO TEMPLATE DEMO</b>
        <span>“Cartogram” is a fictional SaaS product. Every customer, quote, and figure below is demo content.</span>
      </p>

      <BlockNav
        scheme="light"
        accent="#0f766e"
        brand="Cartogram"
        brandHref="#cartogram-top"
        links={[
          { label: "Platform", href: "#cartogram-platform" },
          { label: "Proof", href: "#cartogram-proof" },
          { label: "Stories", href: "#cartogram-stories" },
          { label: "Contact", href: "#cartogram-contact" },
        ]}
        action={{ label: "Book a demo", href: "#cartogram-contact" }}
        secondaryAction={{ label: "Sign in", href: "#cartogram-top" }}
      />

      <HeroAuroraEditorial
        scheme="light"
        eyebrow="Customer journey analytics"
        title="See every path\ncustomers take."
        subtitle="Cartogram replays real journeys from your warehouse and draws the map as it goes — where people flourish, where they quietly leave."
        detail="Set in real, selectable type over a computed aurora. Every word here is yours to replace."
        primaryCta={{ label: "Start mapping free", href: "#cartogram-contact" }}
        secondaryCta={{ label: "Book a walkthrough", href: "#cartogram-contact" }}
        primary="#0d9488"
        secondary="#6366f1"
        bands={4}
        intensity={0.7}
        speed={0.5}
      />

      <BlockLogos
        scheme="light"
        accent="#0f766e"
        eyebrow="Trusted with real journeys"
        title="Teams who read the map."
        description="A few of the product, growth, and support teams navigating with Cartogram."
        logos={[
          { name: "Hearthside", href: "#cartogram-top" },
          { name: "Northline", href: "#cartogram-top" },
          { name: "Tempo Bank", href: "#cartogram-top" },
          { name: "Ferrywood", href: "#cartogram-top" },
          { name: "Copperfield", href: "#cartogram-top" },
          { name: "Bloom & Co", href: "#cartogram-top" },
          { name: "Aster Works", href: "#cartogram-top" },
          { name: "Kestrel", href: "#cartogram-top" },
          { name: "plainwater", href: "#cartogram-top" },
          { name: "Vantage Rail", href: "#cartogram-top" },
        ]}
        columns={5}
        demoNote="Customers above are fictional demo content."
      />

      <div id="cartogram-platform">
        <BlockFeatureGrid
          scheme="light"
          accent="#0f766e"
          layout="even"
          eyebrow="The platform"
          title="Four instruments, one map."
          description="Each one answers a question your dashboard never could."
          items={[
            { title: "Replay any session", description: "Pick a journey — signup, checkout, a quiet Tuesday — and walk it step by step, with the product state at every screen." },
            { title: "Maps that draw themselves", description: "No funnel builder to maintain. Cartogram derives the map from events you already emit, and keeps it honest as product changes." },
            { title: "Warehouse-native", description: "Queries run against your Snowflake or BigQuery. Nothing duplicated, nothing stale, and your access rules still apply." },
            { title: "Alerts before the drop-off", description: "When a path starts leaking — a release, a browser, a region — the team hears about it before the weekly review does." },
          ]}
        />
      </div>

      <div id="cartogram-proof">
        <BlockComparison
          scheme="light"
          accent="#0f766e"
          eyebrow="A closer look"
          title="The dashboard you have. The story you need."
          description="One product, two readings. Drag the handle to move from a wall of aggregates to the journey behind them."
          beforeLabel="Aggregates only"
          afterLabel="Journeys, drawn"
          caption="Cartogram · fictional analytics screens, drag to compare"
          defaultPosition={50}
        />
      </div>

      <div id="cartogram-stories">
        <BlockTestimonials
          scheme="light"
          accent="#0f766e"
          featured
          eyebrow="Field notes"
          title="What changes when you can see the path."
          description="Quotes from fictional teams — replace them with your own customers' words."
          testimonials={[
            { quote: "We argued about funnels for two quarters. The first journey map ended the argument in an afternoon.", name: "Ingrid Halvorsen", role: "Head of Growth, Tempo Bank" },
            { quote: "Support stopped filing mystery tickets. They open Cartogram, watch the path, and attach the exact screen.", name: "Marcus Bell", role: "Support Lead, Northline" },
            { quote: "It reads our warehouse directly, so the map is never a week old. That alone changed how we plan releases.", name: "Aiko Tanaka", role: "Data Platform, Aster Works" },
            { quote: "The drop-off alert caught a broken checkout on Safari before Black Friday. It paid for the year in one morning.", name: "Renata Cruz", role: "Director of Product, Hearthside" },
          ]}
          demoNote="All quotes and teams above are fictional demo content."
        />
      </div>

      <BlockNewsletter
        scheme="light"
        accent="#0f766e"
        eyebrow="The Cartogram letter"
        title="One careful email a month."
        description="New maps, subtle product changes, and a short read on journey analytics. No growth hacks."
        emailLabel="Work email"
        placeholder="you@company.com"
        submitLabel="Subscribe"
        successTitle="You're on the list."
        successNote="A confirmation would normally be on its way. This demo form sends nothing."
        demoNote="Demo mode — subscriptions stay on this page."
      />

      <div id="cartogram-contact">
        <BlockContact
          scheme="light"
          accent="#0f766e"
          eyebrow="Talk to us"
          title="Tell us where your journeys go quiet."
          description="A thirty-minute walkthrough with someone who builds the product — not a slide deck."
          channels={[
            { label: "Email", value: "hello@cartogram.example", href: "mailto:hello@cartogram.example", note: "Replies within one business day." },
            { label: "Demos", value: "Book a walkthrough", href: "#cartogram-contact", note: "Tue–Thu, 9:00–16:00 CET." },
            { label: "Office", value: "Sint-Annastraat 14, Ghent", note: "Visits by appointment." },
          ]}
          fields={[
            { name: "name", label: "Your name", type: "text", placeholder: "Ingrid Halvorsen", required: true, autoComplete: "name" },
            { name: "email", label: "Work email", type: "email", placeholder: "you@company.com", required: true, autoComplete: "email" },
            { name: "company", label: "Company", type: "text", placeholder: "Tempo Bank", autoComplete: "organization" },
            { name: "message", label: "What are you trying to see?", type: "textarea", placeholder: "Our signup path works until the second step…", required: true, rows: 4 },
          ]}
          submitLabel="Send message"
          successNote="Sent — well, almost. This demo form keeps everything on the page."
          demoNote="Demo mode — form values never leave this page."
        />
      </div>

      <FooterTidal
        brand="CARTOGRAM"
        color="#e8b58b"
        background="#151b20"
        title="Every journey\nends better."
        description="Warehouse-native journey analytics for teams who'd rather see the path than argue about it."
        cta={{ label: "Start mapping free", href: "#cartogram-contact" }}
        groups={[
          { label: "Product", links: [{ label: "Platform", href: "#cartogram-platform" }, { label: "Comparison", href: "#cartogram-proof" }, { label: "Changelog", href: "#cartogram-top" }] },
          { label: "Company", links: [{ label: "Stories", href: "#cartogram-stories" }, { label: "The letter", href: "#cartogram-top" }, { label: "Careers", href: "#cartogram-top" }] },
          { label: "Resources", links: [{ label: "Documentation", href: "#cartogram-top" }, { label: "Status", href: "#cartogram-top" }, { label: "Security", href: "#cartogram-top" }] },
        ]}
        legal={[{ label: "Privacy", href: "#cartogram-top" }, { label: "Terms", href: "#cartogram-top" }]}
        copyright="© 2026 Cartogram BV. Cartogram is a fictional product — customers, quotes, and figures are demo content. Pro template built with vfx-ui."
      />
    </div>
  );
}
