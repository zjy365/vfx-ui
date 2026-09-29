"use client";

import type { CSSProperties } from "react";
import {
  BlockCta,
  BlockGallery,
  BlockNav,
  BlockQuoteWall,
  BlockStats,
  BlockTeam,
  BlockTimeline,
  FooterFold,
  HeroChromaFull,
} from "@vfx-ui/react";

/**
 * Pro template — personal portfolio (fictional designer-developer "Juno
 * Reyes"). Dark, vivid, unapologetically colorful: chroma edges bleed around
 * the masthead, work opens in a lightbox, and the page folds shut on paper.
 * Every string is demo content, marked visibly at the top of the screen.
 */
export default function Portfolio({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div id="portfolio-top" className={`vfx-pro-portfolio${className ? ` ${className}` : ""}`} style={style}>
      <style>{`
.vfx-pro-portfolio{background:#130e1e;color:#f2edfa;font-family:"Geist","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;container-type:inline-size}
.vfx-pro-portfolio *{box-sizing:border-box}.vfx-pro-portfolio [id]{scroll-margin-top:88px}.vfx-pro-portfolio a{color:inherit;text-decoration:none}
.vfx-pro-portfolio .vfx-block[data-scheme="dark"]{--vb-bg:#130e1e}
.vfx-pro-portfolio .vfx-portfolio-demo{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:10px 24px;border-bottom:1px solid #6d5ae026;background:#6d5ae00f;font:10px/1.6 ui-monospace,monospace;letter-spacing:.05em;color:#a49ad8}
.vfx-pro-portfolio .vfx-portfolio-demo b{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border:1px solid #6d5ae059;border-radius:4px;background:#6d5ae01c;color:#9d8cff;font-weight:500;letter-spacing:.14em}
@container(max-width:760px){.vfx-pro-portfolio .vfx-portfolio-demo{padding:12px 16px;text-align:center}}
      `}</style>

      {/* Visible demo labeling — the screen-top marker required by Pro templates. */}
      <p className="vfx-portfolio-demo" role="note">
        <b>PRO TEMPLATE DEMO</b>
        <span>“Juno Reyes” is a fictional portfolio. Every project, quote, and number below is demo content.</span>
      </p>

      <BlockNav
        scheme="dark"
        accent="#f472b6"
        brand="Juno Reyes"
        brandHref="#portfolio-top"
        links={[
          { label: "Work", href: "#portfolio-work" },
          { label: "Path", href: "#portfolio-path" },
          { label: "About", href: "#portfolio-about" },
        ]}
        action={{ label: "Available for work", href: "#portfolio-availability" }}
        secondaryAction={null}
      />

      <HeroChromaFull
        eyebrow="Interface artist · Creative developer"
        title="Color is a\nmaterial."
        subtitle="I build tactile, GPU-rendered interfaces for teams who care how a product feels in the hand — nine years of pixels with intent."
        primaryCta={{ label: "See the work", href: "#portfolio-work" }}
        secondaryCta={{ label: "Say hello", href: "#portfolio-availability" }}
        baseColor="#160a26"
        upColor="#a855f7"
        downColor="#f5f0ff"
        leftColor="#f472b6"
        rightColor="#fbbf24"
        ambient={0.7}
        speed={0.6}
        radius={0.6}
      />

      <div id="portfolio-work">
        <BlockGallery
          scheme="dark"
          accent="#f472b6"
          eyebrow="Selected work / 2019–2026"
          title="Six things made carefully."
          description="Click any piece to open it full-screen. Media here is generated demo artwork — drop in your own images or videos."
          lightbox
          items={[
            { title: "Lumen — launch film in the browser", caption: "WebGPU direction, 2026 (demo)", tall: true },
            { title: "Vessel — a museum kiosk that breathes", caption: "Installation, 2025 (demo)" },
            { title: "Fieldwalk — field-recording atlas", caption: "Product design, 2025 (demo)" },
            { title: "Orrery — planning tool as orrery", caption: "Product design, 2024 (demo)" },
            { title: "Stitch — variable type playground", caption: "Type experiments, 2023 (demo)" },
            { title: "Nightjar — album that renders itself", caption: "Art direction & code, 2022 (demo)" },
          ]}
          demoNote="Projects and artwork above are fictional demo content."
        />
      </div>

      <BlockStats
        scheme="dark"
        accent="#fbbf24"
        eyebrow="The ledger"
        title="Nine years, counted loosely."
        stats={[
          { value: 46, label: "Projects shipped", description: "From three-day sketches to two-year builds." },
          { value: 9, label: "Years in motion", description: "Flash first, then canvas, now WebGPU." },
          { value: 17, label: "Talks & workshops", description: "Mostly about type and time." },
          { value: 12000, label: "GPU hours, roughly", description: "A conservative estimate, honestly." },
        ]}
        demoNote="Demo figures for a fictional portfolio."
      />

      <div id="portfolio-path">
        <BlockTimeline
          scheme="dark"
          accent="#f472b6"
          eyebrow="The path"
          title="How it went."
          description="Stops, swerves, and the good kind of detours."
          events={[
            { when: "2026", title: "Full-time independent", text: "A studio of one working with product teams on rendered interfaces.", tag: "Now" },
            { when: "2024", title: "First WebGPU production", text: "Shipped a museum kiosk running shader-driven typography at 120fps.", tag: "Milestone" },
            { when: "2022", title: "Lead, experience engineering", text: "Four years building design systems that designers actually opened.", tag: "Chapter" },
            { when: "2019", title: "Went freelance", text: "Motion design by day, canvas experiments by night. The nights won.", tag: "Start" },
          ]}
          demoNote="Fictional history for a fictional person."
        />
      </div>

      <BlockQuoteWall
        scheme="dark"
        accent="#a855f7"
        eyebrow="Voices"
        title="Words from the work."
        description="Collaborators, clients, and one very kind stranger — all fictional."
        mode="wall"
        quotes={[
          { quote: "Juno treats a frame budget the way a composer treats silence.", name: "E. Márquez", role: "Creative director, Vessel" },
          { quote: "The only engineer I've met who argues about kerning with receipts.", name: "S. Oduya", role: "Design lead, Orrery" },
          { quote: "Our launch page made people screenshot it. That was the brief.", name: "M. Feld", role: "Founder, Lumen" },
          { quote: "Taught our whole team to think in motion without saying the word motion.", name: "R. Abiodun", role: "Eng manager, Fieldwalk" },
          { quote: "Delivered the impossible version, then apologized for being late.", name: "T. Lindqvist", role: "Producer, Nightjar" },
          { quote: "Hire Juno. I said it in 2019 and I'll say it again.", name: "A. Costa", role: "Client, thrice" },
        ]}
        demoNote="All voices above are fictional demo content."
      />

      <div id="portfolio-about">
        <BlockTeam
          scheme="dark"
          accent="#f472b6"
          eyebrow="About"
          title="A studio of one, on purpose."
          description="No account managers, no handoffs — you work with the person pushing the pixels. I take on a handful of engagements a year and like them weird."
          members={[
            {
              name: "Juno Reyes",
              role: "Interface artist & creative developer · Ghent / remote",
              href: "#portfolio-about",
              links: [
                { label: "Site", href: "#portfolio-top" },
                { label: "GitHub", href: "#portfolio-top" },
                { label: "Mastodon", href: "#portfolio-top" },
                { label: "Are.na", href: "#portfolio-top" },
              ],
            },
          ]}
          demoNote="Demo portfolio — Juno is fictional."
        />
      </div>

      <div id="portfolio-availability">
        <BlockCta
          scheme="dark"
          accent="#fbbf24"
          eyebrow="Availability"
          title="Let's make something loud."
          description="Two slots open for spring. Bring a hard problem, a real deadline, or an unreasonable idea."
          primaryCta={{ label: "Start a project", href: "#portfolio-availability" }}
          secondaryCta={{ label: "Read the work notes", href: "#portfolio-work" }}
          note="Booking Q2 2026 · Replies within two days · Fictional availability"
        />
      </div>

      <FooterFold
        brand="JUNO"
        color="#292454"
        background="#e5e0f0"
        depth={26}
        title="Fold me into\nyour next project."
        description="A one-person studio for interfaces that move. The paper is pretend; the address works."
        cta={{ label: "hello@juno.example", href: "mailto:hello@juno.example" }}
        groups={[
          { label: "Here", links: [{ label: "Work", href: "#portfolio-work" }, { label: "The path", href: "#portfolio-path" }, { label: "About", href: "#portfolio-about" }] },
          { label: "Elsewhere", links: [{ label: "GitHub", href: "#portfolio-top" }, { label: "Mastodon", href: "#portfolio-top" }, { label: "Are.na", href: "#portfolio-top" }] },
        ]}
        legal={[{ label: "Colophon", href: "#portfolio-top" }, { label: "Imprint", href: "#portfolio-top" }]}
        copyright="© 2026 Juno Reyes — a fictional portfolio; projects, quotes, and figures are demo content. Pro template built with vfx-ui."
      />
    </div>
  );
}
