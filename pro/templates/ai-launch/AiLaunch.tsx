"use client";

import type { CSSProperties } from "react";
import {
  BlockBanner,
  BlockCta,
  BlockFaq,
  BlockFeatureTabs,
  BlockNav,
  BlockPricing,
  BlockShowcase,
  BlockStats,
  FooterPhosphor,
  HeroVortexCentered,
} from "@vfx-ui/react";

/**
 * Pro template — AI product launch page (fictional product "Noema" by
 * Parallax Labs). Dark, technical, violet: a vortex hero opens the page and
 * ten vfx-ui sections carry it to a phosphor footer. Every string is demo
 * content, marked visibly at the top of the screen.
 */
export default function AiLaunch({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div id="noema-top" className={`vfx-pro-ai${className ? ` ${className}` : ""}`} style={style}>
      <style>{`
.vfx-pro-ai{background:#0d0c14;color:#eceaf6;font-family:"Geist","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;container-type:inline-size}
.vfx-pro-ai *{box-sizing:border-box}.vfx-pro-ai [id]{scroll-margin-top:88px}.vfx-pro-ai a{color:inherit;text-decoration:none}
.vfx-pro-ai .vfx-block[data-scheme="dark"]{--vb-bg:#0d0c14}
.vfx-pro-ai .vfx-ai-demo{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:10px 24px;border-bottom:1px solid #6d5ae026;background:#6d5ae00f;font:10px/1.6 ui-monospace,monospace;letter-spacing:.05em;color:#a49ad8}
.vfx-pro-ai .vfx-ai-demo b{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border:1px solid #6d5ae059;border-radius:4px;background:#6d5ae01c;color:#9d8cff;font-weight:500;letter-spacing:.14em}
@container(max-width:760px){.vfx-pro-ai .vfx-ai-demo{padding:12px 16px;text-align:center}}
      `}</style>

      {/* Visible demo labeling — the screen-top marker required by Pro templates. */}
      <p className="vfx-ai-demo" role="note">
        <b>PRO TEMPLATE DEMO</b>
        <span>“Noema” is a fictional AI product. Every quote, figure, plan, and logo below is demo content.</span>
      </p>

      <BlockBanner
        scheme="dark"
        accent="#9d8cff"
        sticky={false}
        message="Noema 2.0 is rolling out this week — citation graphs now recurse three levels deep on every plan. (demo)"
        action={{ label: "Read the announcement", href: "#noema-product" }}
      />

      <BlockNav
        scheme="dark"
        accent="#9d8cff"
        brand="noema"
        brandHref="#noema-top"
        links={[
          { label: "Product", href: "#noema-product" },
          { label: "Model", href: "#noema-model" },
          { label: "Pricing", href: "#noema-pricing" },
          { label: "FAQ", href: "#noema-faq" },
        ]}
        action={{ label: "Start free", href: "#noema-pricing" }}
        secondaryAction={{ label: "Sign in", href: "#noema-top" }}
      />

      <HeroVortexCentered
        eyebrow="Noema 2.0 · Reasoning engine"
        title="Answers you can\naudit."
        subtitle="Noema reads your corpus, reasons across it, and returns every claim with the exact source attached. No hallucinated confidence — just traceable thought."
        primaryCta={{ label: "Start reasoning free", href: "#noema-pricing" }}
        secondaryCta={{ label: "Watch it think", href: "#noema-product" }}
        color="#6d5ae0"
        emission="#c7d2fe"
        coreGlow={1.6}
        speed={0.32}
        swirl={3.4}
        arms={3}
      />

      <div id="noema-product">
        <BlockShowcase
          scheme="dark"
          accent="#9d8cff"
          eyebrow="The workspace / 01"
          title="A reasoning layer for everything you've read."
          description="Sources, claims, and threads of argument in one canvas. Ask a question and watch Noema assemble the answer — citation by citation — in front of you."
          caption="NOEMA WORKSPACE / FICTIONAL PRODUCT UI / DEMO"
          interactive
        />
      </div>

      <div id="noema-model">
        <BlockFeatureTabs
          scheme="dark"
          accent="#9d8cff"
          eyebrow="Under the hood"
          title="Built to show its work."
          description="Four things the Noema engine promises — and proves — on every query."
          tabs={[
            { label: "Citation graph", description: "Every answer is a graph you can expand: claim, source, and the two hops of context that earned it." },
            { label: "Persistent memory", description: "Your reading history becomes structure. Noema remembers what you've verified and never asks you to re-prove it." },
            { label: "Guardrails & evals", description: "Run any question through your own eval suite before it reaches the team. Unverifiable claims come back marked, not hidden." },
            { label: "Runs where you work", description: "Local model for sensitive corpora, hosted for scale, and a CLI for pipelines. Same graph everywhere." },
          ]}
          action={{ label: "Read the model card", href: "#noema-model" }}
        />
      </div>

      <BlockStats
        scheme="dark"
        accent="#9d8cff"
        eyebrow="In numbers"
        title="Measured, then shown."
        description="Demo figures for a fictional product — swap in your own telemetry before shipping."
        stats={[
          { value: 4.1, decimals: 1, suffix: "s", label: "Median first answer", description: "Question in, cited answer out." },
          { value: 92, suffix: "%", label: "Citation precision", description: "Internal eval set, marked demo." },
          { value: 38000, label: "Researchers aboard", description: "From PhD candidates to newsrooms." },
          { value: 0, label: "Unsourced claims shipped", description: "The one number we promise stays at zero." },
        ]}
        demoNote="Figures shown here are fictional demo content."
      />

      <div id="noema-pricing">
        <BlockPricing
          scheme="dark"
          accent="#9d8cff"
          eyebrow="Pricing"
          title="Pay for depth, not seats."
          description="Three plans, one engine. Annual billing saves roughly two months."
          defaultPeriod="annual"
          annualNote="Two months free"
          plans={[
            {
              name: "Explorer",
              priceMonthly: 0,
              basis: "month",
              description: "For one curious mind and a modest library.",
              features: ["1 workspace", "2,000 sources", "Citation graph, 1 hop", "Community support"],
              cta: { label: "Start exploring", href: "#noema-cta" },
            },
            {
              name: "Researcher",
              priceMonthly: 29,
              priceAnnual: 24,
              featured: true,
              badge: "Most cited",
              description: "For people whose answers matter out loud.",
              features: ["Unlimited workspaces", "50,000 sources", "Full recursive graph", "Eval suites & guardrails", "Priority support"],
              cta: { label: "Try Researcher free", href: "#noema-cta" },
            },
            {
              name: "Lab",
              priceMonthly: 99,
              priceAnnual: 82,
              description: "Shared corpora, SSO, and the audit trail your compliance team wants.",
              features: ["Everything in Researcher", "Shared team corpora", "SSO & audit exports", "On-prem model option"],
              cta: { label: "Talk to us", href: "#noema-cta" },
            },
          ]}
          footnote="Fictional plans for a fictional product. Prices in USD."
        />
      </div>

      <div id="noema-faq">
        <BlockFaq
          scheme="dark"
          accent="#9d8cff"
          eyebrow="Questions"
          title="Fair questions, straight answers."
          description="The things research teams ask before trusting an engine with their reading."
          items={[
            { question: "Does Noema ever answer without a source?", answer: "No. If the graph cannot connect a claim to a source you've indexed, the claim comes back marked “unverified” instead of confident. Silence is a feature." },
            { question: "Where does my corpus live?", answer: "Explorer and Researcher corpora live in an encrypted tenant on our side. Lab plans can keep everything on-prem with the local model — nothing leaves your network." },
            { question: "Which models power the engine?", answer: "A routed ensemble: a small local model for retrieval and structure, larger hosted models for synthesis. The model card lists every version, and evals run against your own suite." },
            { question: "Can I export my graph?", answer: "Always. The full citation graph exports as JSON and GraphML on every plan, including Explorer. Your reading is yours." },
            { question: "Do you train on my documents?", answer: "No. Your corpus is used to answer your questions and nothing else. It is deleted with your workspace, export first if you want a copy." },
          ]}
          contact={{ text: "A different question?", action: { label: "Ask in the forum", href: "#noema-cta" } }}
        />
      </div>

      <div id="noema-cta">
        <BlockCta
          scheme="dark"
          accent="#9d8cff"
          eyebrow="Open the black box"
          title="Reasoning you can check, line by line."
          description="Point Noema at a folder of papers and ask it something hard. The first graph is on us."
          primaryCta={{ label: "Choose your plan", href: "#noema-pricing" }}
          secondaryCta={{ label: "See the workspace", href: "#noema-product" }}
          note="Free for personal research · No card required · Demo"
        />
      </div>

      <FooterPhosphor
        brand="NOEMA"
        color="#9d8cff"
        background="#120f1c"
        title="Think in\nthe open."
        description="A reasoning engine that never asks you to trust it — only to check its work."
        cta={{ label: "Read the docs", href: "#noema-model" }}
        groups={[
          { label: "Product", links: [{ label: "Workspace", href: "#noema-product" }, { label: "Model card", href: "#noema-model" }, { label: "Pricing", href: "#noema-pricing" }] },
          { label: "Company", links: [{ label: "About Parallax", href: "#noema-top" }, { label: "Changelog", href: "#noema-top" }, { label: "Careers", href: "#noema-top" }] },
          { label: "Resources", links: [{ label: "Documentation", href: "#noema-model" }, { label: "Status", href: "#noema-top" }, { label: "Security", href: "#noema-faq" }] },
        ]}
        legal={[{ label: "Privacy", href: "#noema-top" }, { label: "Terms", href: "#noema-top" }]}
        copyright="© 2026 Parallax Labs. Noema is a fictional product — quotes, figures, and plans are demo content. Pro template built with vfx-ui."
      />
    </div>
  );
}
