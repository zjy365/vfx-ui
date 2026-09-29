"use client";

import type { CSSProperties } from "react";
import { BlockNav } from "./BlockNav";
import { BlockShowcase } from "./BlockShowcase";
import { BlockFeatureGrid } from "./BlockFeatureGrid";
import { BlockFeatureTabs } from "./BlockFeatureTabs";
import { BlockScrollStory } from "./BlockScrollStory";
import { BlockIntegrations } from "./BlockIntegrations";
import { BlockPricing } from "./BlockPricing";
import { BlockTestimonials } from "./BlockTestimonials";
import { BlockFaq } from "./BlockFaq";
import { BlockCta } from "./BlockCta";

/** A fictional launch site. All links stay within the example; copy and plans are illustrative. */
export function ExampleLaunch({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div id="launch-top" className={`vfx-example vfx-example-launch${className ? ` ${className}` : ""}`} style={style}>
    <style>{`
.vfx-example-launch{background:#111210;color:#f2f3ed;font-family:"Geist","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;container-type:inline-size}
.vfx-example-launch *{box-sizing:border-box}.vfx-example-launch [id]{scroll-margin-top:100px}.vfx-example-launch a{color:inherit;text-decoration:none}.vfx-example-launch a:focus-visible{outline:2px solid #d5ed9a;outline-offset:5px}
.vfx-launch-hero{max-width:1200px;margin:auto;padding:100px 64px 64px;text-align:center;position:relative;overflow:hidden}
.vfx-launch-label{display:inline-flex;align-items:center;gap:10px;color:#c9d0be;font:10px ui-monospace,monospace;letter-spacing:.04em;margin-bottom:30px;padding:8px 12px;border:1px solid #ffffff20;border-radius:5px}.vfx-launch-label i{width:5px;height:5px;background:#d5ed9a;border-radius:50%}
.vfx-example-launch .vfx-launch-hero h1{font-size:clamp(48px,7.6cqw,92px);font-weight:500;letter-spacing:-.065em;line-height:1.02;color:#f2f3ed;max-width:11ch;margin:0 auto 28px;text-wrap:balance}.vfx-launch-hero h1 em{font-style:normal;color:#a5ac9c}
.vfx-example-launch .vfx-launch-hero>p{font-size:16px;line-height:1.8;color:#a5ac9c;max-width:46ch;margin:0 auto 30px}
.vfx-launch-actions{display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;font-size:12px}.vfx-launch-actions a:first-child{background:#d5ed9a;color:#202719;padding:15px 20px;border-radius:6px}.vfx-launch-actions a{transition:transform 180ms}.vfx-launch-actions a:hover{transform:translateY(-2px)}
.vfx-launch-rail{display:flex;align-items:center;justify-content:center;margin-top:70px;padding:32px 16px;border-block:1px solid #ffffff16;gap:0;position:relative;background:radial-gradient(ellipse at 50% 100%,#d5ed9a09,transparent 60%)}
.vfx-launch-node{display:flex;gap:10px;align-items:center;text-align:left;padding:14px 18px;border:1px solid #ffffff25;border-radius:7px;background:#191b17;font-size:11px;min-width:150px}.vfx-launch-node small{display:block;margin-top:5px;color:#838b79;font-size:9px}.vfx-launch-node i{font-style:normal;color:#d5ed9a;width:24px;height:24px;display:grid;place-items:center;background:#d5ed9a10;border-radius:4px}.vfx-launch-connector{width:70px;height:1px;background:#d5ed9a55;position:relative}.vfx-launch-connector::after{content:"";width:4px;height:4px;border-radius:50%;position:absolute;right:0;top:-1px;background:#d5ed9a}
.vfx-launch-proof{display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1072px;margin:0 auto;padding:28px 0;color:#969d8e;border-bottom:1px solid #ffffff16}.vfx-launch-proof span{font:9px/1.6 ui-monospace,monospace;max-width:14ch}.vfx-launch-proof b{font-size:19px;font-weight:500;letter-spacing:-.04em}
.vfx-launch-footer{max-width:1200px;margin:auto;padding:48px 64px 32px;display:flex;justify-content:space-between;gap:32px;flex-wrap:wrap;border-top:1px solid #ffffff16}.vfx-launch-footer strong{font-size:26px;letter-spacing:-.05em}.vfx-launch-footer nav{display:flex;gap:24px;font-size:12px;align-items:center}.vfx-launch-footer small{width:100%;font:9px ui-monospace,monospace;color:#838b79;margin-top:24px}
@container(max-width:760px){.vfx-launch-hero{padding:64px 24px 32px}.vfx-launch-hero h1{font-size:58px}.vfx-launch-node{min-width:0;padding:12px;font-size:9px}.vfx-launch-node i{display:none}.vfx-launch-connector{width:20px;flex:none}.vfx-launch-proof{margin:0 24px;flex-wrap:wrap;justify-content:center}.vfx-launch-proof span{max-width:none;width:100%;text-align:center}.vfx-launch-proof b{font-size:16px}.vfx-launch-footer{padding:32px 24px}.vfx-launch-rail{margin-top:48px;padding-inline:0}.vfx-launch-node small{font-size:8px}}
@media(prefers-reduced-motion:reduce){.vfx-launch-actions a{transition:none;transform:none!important}}
    `}</style>
    <BlockNav brand="orbit" brandHref="#launch-top" links={[{label:"Product",href:"#launch-product"},{label:"Workflow",href:"#launch-story"},{label:"Pricing",href:"#launch-pricing"}]} action={{label:"Start building",href:"#launch-cta"}} secondaryAction={{label:"Explore the workspace",href:"#launch-product"}} />
    <section className="vfx-launch-hero">
      <span className="vfx-launch-label"><i />Introducing Orbit 2.0 <span>↗</span></span>
      <h1>Less friction.<br /><em>More shipping.</em></h1>
      <p>A calmer place to plan, deploy, and keep moving. Your whole release, in one connected workspace.</p>
      <div className="vfx-launch-actions"><a href="#launch-pricing">Start building for free ↗</a><a href="#launch-product">Take a look inside ↓</a></div>
      <div className="vfx-launch-rail" aria-label="Release workflow illustration">
        <div className="vfx-launch-node"><i>⑂</i><span>Push your code<small>main / a4c82e1</small></span></div><span className="vfx-launch-connector" />
        <div className="vfx-launch-node"><i>✓</i><span>Checks passed<small>12 of 12 complete</small></span></div><span className="vfx-launch-connector" />
        <div className="vfx-launch-node"><i>↗</i><span>You're live<small>Production · healthy</small></span></div>
      </div>
    </section>
    <div className="vfx-launch-proof"><span>FICTIONAL TEAMS.<br />A SHARED AMBITION.</span><b>Fieldnote</b><b>Layers®</b><b>plainwork</b><b>Quotient</b><b>Minted.</b></div>
    <div id="launch-product"><BlockShowcase title="The big picture. Every little detail." primaryCta={null} secondaryCta={null} interactive={false} /></div>
    <div id="launch-features"><BlockFeatureGrid /></div>
    <BlockFeatureTabs action={{label:"See the workflow",href:"#launch-story"}} />
    <div id="launch-story"><BlockScrollStory flip title="A better rhythm for your week." /></div>
    <div id="launch-integrations"><BlockIntegrations integrations={["GitHub", "Linear", "Slack", "Datadog", "Figma", "PagerDuty", "Notion", "Vercel"].map(name => ({ name, href: "#launch-product", description: `Explore ${name} in the demo workspace` }))} action={{label:"Explore the workspace",href:"#launch-product"}} /></div>
    <div id="launch-pricing"><BlockPricing plans={[
      {name:"Personal",priceMonthly:0,basis:"month",description:"For the ideas you can't leave alone.",features:["1 workspace","Unlimited viewers","7-day activity history","Community support"],cta:{label:"Start a project",href:"#launch-cta"}},
      {name:"Team",priceMonthly:24,priceAnnual:20,featured:true,badge:"Made for teams",description:"A shared space to do your best work.",features:["Unlimited workspaces","90-day activity history","Automated canary releases","Priority support"],cta:{label:"Try Team free",href:"#launch-cta"}},
      {name:"Scale",priceMonthly:89,priceAnnual:74,description:"More control, without more overhead.",features:["Everything in Team","SSO & audit exports","Custom data retention","Dedicated onboarding"],cta:{label:"Let's talk",href:"#launch-cta"}},
    ]} /></div>
    <BlockTestimonials testimonials={[
      {quote:"We stopped writing status updates. The replay is the status update. Friday feels like Friday again.",name:"Mara Ellison",role:"Head of Platform, Fieldnote"},
      {quote:"A release used to mean eight tabs and a checklist. Now we open Orbit and get on with it.",name:"Deniz Okafor",role:"Staff Engineer, Layers"},
      {quote:"The little details add up. This is the first tool our whole team actually wants to open.",name:"Priya Raman",role:"VP Engineering, Plainwork"},
      {quote:"We have a clear view of what shipped, what changed, and what comes next.",name:"Jonas Feld",role:"CTO, Quotient"},
    ]} />
    <div id="launch-faq"><BlockFaq contact={{text:"Have a different question?",action:{label:"Explore the product",href:"#launch-product"}}} /></div>
    <div id="launch-cta"><BlockCta eyebrow="Make room for the work" title="Your next great thing starts here." primaryCta={{label:"Choose your plan",href:"#launch-pricing"}} secondaryCta={{label:"Take the tour",href:"#launch-product"}} note="Free for personal projects · No credit card needed · Demo" /></div>
    <footer className="vfx-launch-footer"><strong>orbit</strong><nav aria-label="Orbit footer"><a href="#launch-product">Product</a><a href="#launch-pricing">Pricing</a><a href="#launch-faq">Questions</a><a href="#launch-top">Back to top ↑</a></nav><small>© 2026 Lumen Labs. Orbit is a fictional product. Built with vfx-ui.</small></footer>
  </div>;
}
