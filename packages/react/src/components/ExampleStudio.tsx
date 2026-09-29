"use client";

import type { CSSProperties } from "react";
import { BlockNav } from "./BlockNav";
import { BlockProcessSteps } from "./BlockProcessSteps";
import { BlockShowcase } from "./BlockShowcase";
import { BlockComparison } from "./BlockComparison";
import { BlockFeatureGrid } from "./BlockFeatureGrid";
import { BlockPricing } from "./BlockPricing";
import { BlockTestimonials } from "./BlockTestimonials";
import { BlockFaq } from "./BlockFaq";
import { BlockCta } from "./BlockCta";

const studioTheme = { scheme: "light", accent: "#d7e2be" } as const;

/** Fictional independent studio, composed with the same blocks in a daylight palette. */
export function ExampleStudio({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div id="studio-top" className={`vfx-example-studio${className ? ` ${className}` : ""}`} style={style}>
    <style>{`
.vfx-example-studio{background:#f7f7f2;color:#22251f;font-family:"Geist","Helvetica Neue",Arial,sans-serif;container-type:inline-size;-webkit-font-smoothing:antialiased}.vfx-example-studio *{box-sizing:border-box}.vfx-example-studio [id]{scroll-margin-top:40px}.vfx-example-studio a{color:inherit;text-decoration:none}.vfx-example-studio a:focus-visible{outline:2px solid #416237;outline-offset:5px}
.vfx-studio-opening{max-width:1200px;margin:auto;padding:72px 64px 64px}.vfx-studio-kicker{display:flex;justify-content:space-between;gap:24px;font:10px ui-monospace,monospace;color:#65705d;margin-bottom:40px}.vfx-studio-kicker span:last-child::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:#65705d;margin-right:8px}
.vfx-example-studio .vfx-studio-opening h1{font:400 clamp(58px,8.3cqw,100px)/1 Georgia,"Times New Roman",serif;letter-spacing:-.065em;margin:0 0 40px;max-width:13ch;color:#283022}.vfx-studio-opening h1 em{font-weight:400;color:#728366}
.vfx-studio-intro{display:flex;justify-content:space-between;align-items:flex-end;gap:32px}.vfx-example-studio .vfx-studio-intro p{font-size:15px;line-height:1.75;max-width:40ch;color:#64705c;margin:0}.vfx-studio-intro a{font-size:12px;border-bottom:1px solid #829078;padding-bottom:8px;white-space:nowrap}
.vfx-studio-art{position:relative;display:flex;align-items:center;justify-content:center;gap:0;background:#dce2d1;width:100%;height:100%;min-height:280px;overflow:hidden}
.vfx-studio-art::before{content:"";position:absolute;inset:60% -10% -50%;background:#ccd5bf;border-radius:50%;transform:rotate(-10deg)}
.vfx-studio-pack{position:relative;width:21%;aspect-ratio:.64;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:6px 6px 15px 15px;background:#526444;color:#eef0dd;border-top:14px solid #46593a;box-shadow:20px 30px 36px #364d2f30;transform:rotate(-10deg);z-index:2}
.vfx-studio-pack:nth-child(2){background:#f3efde;color:#4e5d40;border-top-color:#e6e3d2;transform:translate(20%,-5%) rotate(10deg);z-index:1}
.vfx-studio-pack b{font:italic clamp(50px,10cqw,110px)/1 Georgia,serif}.vfx-studio-pack span{font:10px ui-monospace,monospace;letter-spacing:.18em;margin-top:18px}.vfx-studio-pack small{font:7px ui-monospace,monospace;margin-top:32px}.vfx-studio-art-caption{position:absolute;left:5%;bottom:7%;font:9px ui-monospace,monospace;color:#4a5e3d;z-index:3}
.vfx-example-studio .vfx-showcase .vfx-block-head{align-items:flex-start;text-align:left;margin-inline:0}.vfx-example-studio .vfx-showcase .vfx-block-lede{margin-inline:0}.vfx-example-studio .vfx-showcase-stage{padding:0;border:0;background:none}.vfx-example-studio .vfx-showcase-frame{border:0;box-shadow:none;border-radius:0}.vfx-example-studio .vfx-showcase-chrome{display:none}.vfx-example-studio .vfx-showcase-screen{aspect-ratio:1.8}.vfx-example-studio .vfx-showcase-caption{text-align:left}
.vfx-example-studio .vfx-block-title{font-family:Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.05em}.vfx-example-studio .vfx-cta-title{font-family:Georgia,"Times New Roman",serif;font-weight:400}.vfx-example-studio .vfx-feature-cell-glyph{display:none}.vfx-example-studio .vfx-feature-cell h3{font-family:Georgia,serif;font-size:26px}.vfx-example-studio .vfx-testimonials-featured blockquote{font-family:Georgia,serif}
.vfx-studio-footer{max-width:1200px;margin:auto;padding:56px 64px 32px;border-top:1px solid #d6dacf}.vfx-studio-footer-top{display:flex;justify-content:space-between;gap:24px;align-items:center}.vfx-studio-footer nav{display:flex;gap:24px;font-size:12px}.vfx-studio-footer strong{font:400 clamp(54px,12cqw,144px)/1 Georgia,serif;letter-spacing:-.07em;display:block;margin:50px 0;color:#3f5234}.vfx-studio-footer small{font:9px/1.7 ui-monospace,monospace;color:#65705d}
@container(max-width:760px){.vfx-studio-opening{padding:48px 24px}.vfx-studio-kicker{font-size:8px;margin-bottom:30px;flex-wrap:wrap}.vfx-studio-opening h1{font-size:64px}.vfx-studio-intro{align-items:flex-start;flex-direction:column}.vfx-studio-pack{width:26%}.vfx-studio-pack span{font-size:7px;margin-top:10px}.vfx-studio-pack small{font-size:5px;margin-top:20px}.vfx-studio-pack b{font-size:54px}.vfx-studio-footer{padding:40px 24px}.vfx-studio-footer-top{align-items:flex-start;flex-direction:column}.vfx-studio-art-caption{font-size:7px}}
    `}</style>
    <BlockNav {...studioTheme} brand="Atelier North" brandHref="#studio-top" links={[{label:"Selected work",href:"#studio-work"},{label:"Approach",href:"#studio-process"},{label:"Services",href:"#studio-services"}]} action={{label:"Let's talk",href:"#studio-cta"}} secondaryAction={null} />
    <section className="vfx-studio-opening">
      <div className="vfx-studio-kicker"><span>INDEPENDENT DESIGN STUDIO / EST. 2021</span><span>Open for good conversations</span></div>
      <h1>Thoughtful design.<br /><em>Lasting character.</em></h1>
      <div className="vfx-studio-intro"><p>We build identities and digital places for people with something to say. A small studio. A considered approach.</p><a href="#studio-work">Explore selected work ↓</a></div>
    </section>
    <div id="studio-work"><BlockShowcase {...studioTheme} eyebrow="Selected work / 01" title="A fresh start for a daily ritual." description="Meridian Coffee — identity, packaging, and a digital storefront. Built around the simple pleasure of slowing down." primaryCta={null} secondaryCta={null} interactive={false} caption="MERIDIAN COFFEE / BRAND & DIGITAL / FICTIONAL CASE STUDY" media={<div className="vfx-studio-art" role="img" aria-label="Two Meridian coffee bags, one olive and one cream, on a sage backdrop"><div className="vfx-studio-pack"><b>M</b><span>MERIDIAN</span><small>ETHIOPIA / SINGLE ORIGIN</small></div><div className="vfx-studio-pack"><b>M</b><span>MERIDIAN</span><small>COLOMBIA / SINGLE ORIGIN</small></div><span className="vfx-studio-art-caption">GOOD COFFEE. A LITTLE MORE CONSIDERED.</span></div>} /></div>
    <div id="studio-process"><BlockProcessSteps {...studioTheme} eyebrow="Our approach" title="Good work starts with good questions." description="You work directly with the people doing the work. No layers, no lost-in-translation moments." steps={[
      {title:"Find the thread",text:"We listen, look closely, and ask the questions that help us find what makes your work yours.",label:"01"},
      {title:"Give it a shape",text:"We explore a focused set of directions, then build the strongest idea into a coherent system.",label:"02"},
      {title:"Make it real",text:"We work through the details, deliver the files, and stay close as your new identity meets the world.",label:"03"},
    ]} action={{label:"Explore engagements",href:"#studio-pricing"}} /></div>
    <div id="studio-comparison"><BlockComparison {...studioTheme} eyebrow="A closer look" title="The difference is in the details." description="One product, two expressions. Drag to see how typography, color, and composition change the whole story." beforeLabel="The starting point" afterLabel="A new direction" caption="Meridian Coffee · Fictional design study" /></div>
    <div id="studio-services"><BlockFeatureGrid {...studioTheme} layout="even" eyebrow="What we do" title="A few things, done with care." description="We keep our practice focused so every part of the work gets the attention it deserves." items={[
      {title:"Brand identity",description:"A distinctive voice and visual world. Strategy, naming, marks, type, and the system that holds them together."},
      {title:"Digital experiences",description:"Websites with a clear purpose and a little personality. Designed and built, from first sketch to final interaction."},
      {title:"Art direction",description:"A consistent point of view across photography, packaging, print, and all the places your brand lives."},
    ]} /></div>
    <div id="studio-pricing"><BlockPricing {...studioTheme} eyebrow="Working together" title="Clear scope. Room for good work." description="Three ways to get started. Every engagement begins with a conversation." periodToggle={false} plans={[
      {name:"The sprint",priceMonthly:4800,basis:"once",description:"A focused week for one important question.",features:["Discovery session","5 days of focused design","Working prototype","Recorded walkthrough"],cta:{label:"Talk about a sprint",href:"#studio-cta"}},
      {name:"The project",priceMonthly:14000,basis:"once",featured:true,badge:"A complete picture",description:"An identity or website, from the ground up.",features:["Strategy & creative direction","Design & production","Weekly working sessions","Complete handoff kit"],cta:{label:"Start a conversation",href:"#studio-cta"}},
      {name:"The partnership",priceMonthly:24000,basis:"once",description:"A dedicated season of working together.",features:["Three-month engagement","Brand & digital support","A shared project roadmap","Direct access to the studio"],cta:{label:"Explore a partnership",href:"#studio-cta"}},
    ]} footnote="Illustrative project fees for a fictional studio. All engagements shown are one-time." /></div>
    <BlockTestimonials {...studioTheme} eyebrow="A note from the other side" title="Good work is a shared effort." description={null} testimonials={[
      {quote:"They understood the feeling we were trying to create before we could put it into words. Then they made it tangible.",name:"Mara Ellison",role:"Founder, Meridian Coffee"},
      {quote:"Thoughtful from the first conversation to the final file. Nothing felt like an afterthought.",name:"June Park",role:"Founder, Fieldwork"},
      {quote:"A clear point of view, and the patience to get the details right. We'd do it all again.",name:"Deniz Okafor",role:"Director, Common Ground"},
      {quote:"The site feels like us. That sounds simple, but it's everything we were hoping for.",name:"Priya Raman",role:"Founder, Still House"},
    ]} />
    <div id="studio-faq"><BlockFaq {...studioTheme} eyebrow="Before we begin" title="A little clarity goes a long way." description="The things you might be wondering about working with a small studio." contact={{text:"Something else on your mind?",action:{label:"Let's talk",href:"#studio-cta"}}} items={[
      {question:"Who will we work with?",answer:"The two studio founders lead every engagement, from the initial conversation to the final handoff. You talk directly with the people doing the work."},
      {question:"How long does a project take?",answer:"A sprint takes one week. A brand or website typically takes six to ten weeks, depending on scope. We agree on a realistic schedule together before we begin."},
      {question:"Can we start with something small?",answer:"Absolutely. A focused sprint is a good way to answer one important question and see how we work together."},
      {question:"What do we receive at the end?",answer:"Your final design files, production assets, source code where relevant, and a practical guide to using the work. We make time for a proper handoff."},
    ]} /></div>
    <div id="studio-cta"><BlockCta {...studioTheme} eyebrow="Your move" title="Tell us what you're thinking." description="A rough idea is a perfectly good place to start. We'd love to hear what you're working on." primaryCta={{label:"Explore engagements",href:"#studio-pricing"}} secondaryCta={{label:"Revisit the work",href:"#studio-work"}} note="Independent by choice. Considered by nature. / Demo studio" /></div>
    <footer className="vfx-studio-footer"><div className="vfx-studio-footer-top"><span>Small studio. Long view.</span><nav aria-label="Atelier North footer"><a href="#studio-work">Work</a><a href="#studio-process">Approach</a><a href="#studio-top">Back to top ↑</a></nav></div><strong>Atelier North®</strong><small>© 2026 Atelier North — fictional studio, projects, people, and quotes. Made with vfx-ui.</small></footer>
  </div>;
}
