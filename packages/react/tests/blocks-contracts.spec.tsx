// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BlockNav } from "../src/components/BlockNav";
import { BlockShowcase } from "../src/components/BlockShowcase";
import { BlockFeatureGrid } from "../src/components/BlockFeatureGrid";
import { BlockFeatureTabs } from "../src/components/BlockFeatureTabs";
import { BlockScrollStory } from "../src/components/BlockScrollStory";
import { BlockProcessSteps } from "../src/components/BlockProcessSteps";
import { BlockIntegrations } from "../src/components/BlockIntegrations";
import { BlockComparison } from "../src/components/BlockComparison";
import { BlockTestimonials } from "../src/components/BlockTestimonials";
import { BlockPricing } from "../src/components/BlockPricing";
import { BlockFaq } from "../src/components/BlockFaq";
import { BlockCta } from "../src/components/BlockCta";
import { ExampleLaunch } from "../src/components/ExampleLaunch";
import { ExampleStudio } from "../src/components/ExampleStudio";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  // jsdom lacks IntersectionObserver; blocks must treat that as "visible".
  vi.stubGlobal("IntersectionObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

function press(key: string, target: Element) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
}

describe("block contracts", () => {
  it("keeps disclosure and tab IDs unique across multiple instances", () => {
    act(() => root.render(<><BlockFaq /><BlockFaq /><BlockFeatureTabs /><BlockFeatureTabs /><BlockNav /><BlockNav /></>));
    const ids = [...container.querySelectorAll("[id]")].map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const control of container.querySelectorAll("[aria-controls]")) {
      const id = control.getAttribute("aria-controls")!;
      if (control.getAttribute("aria-expanded") === "false" || control.getAttribute("aria-selected") === "false") continue;
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("example navigation points to sections that exist", () => {
    act(() => root.render(<><ExampleLaunch /><ExampleStudio /></>));
    for (const link of container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      expect(document.getElementById(link.hash.slice(1)), link.hash).not.toBeNull();
    }
  });

  it("nav toggles the mobile sheet, closes on Escape and on link activation", () => {
    act(() => root.render(<BlockNav brand="Testco" />));
    const burger = container.querySelector<HTMLButtonElement>(".vfx-nav-burger")!;
    expect(container.querySelector(".vfx-nav-sheet")).toBeNull();
    act(() => burger.click());
    expect(container.querySelector(".vfx-nav-sheet")).not.toBeNull();
    expect(burger.getAttribute("aria-expanded")).toBe("true");
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(container.querySelector(".vfx-nav-sheet")).toBeNull();
    act(() => burger.click());
    act(() => (container.querySelector(".vfx-nav-sheet a") as HTMLAnchorElement).click());
    expect(container.querySelector(".vfx-nav-sheet")).toBeNull();
  });

  it("nav keeps real link destinations for the desktop actions", () => {
    act(() => root.render(<BlockNav action={{ label: "Go", href: "/start" }} />));
    expect(container.querySelector<HTMLAnchorElement>('.vfx-nav-actions a[href="/start"]')).not.toBeNull();
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });

  it("feature tabs follow the WAI-ARIA keyboard pattern", () => {
    act(() => root.render(<BlockFeatureTabs />));
    const tabList = [...container.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const tabs = (index: number) => tabList[index]!;
    expect(tabList.length).toBeGreaterThanOrEqual(3);
    expect(tabs(0).getAttribute("aria-selected")).toBe("true");
    expect(tabs(1).tabIndex).toBe(-1);
    press("ArrowRight", tabs(0));
    expect(tabs(1).getAttribute("aria-selected")).toBe("true");
    expect(tabs(0).tabIndex).toBe(-1);
    expect(tabs(1).tabIndex).toBe(0);
    const activeLabel = tabs(1).querySelector(".vfx-feature-tab-label")!.textContent;
    const panel = container.querySelector('[role="tabpanel"]')!;
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs(1).id);
    expect(panel.textContent).toContain(activeLabel);
    press("End", tabs(1));
    expect(tabs(tabList.length - 1).getAttribute("aria-selected")).toBe("true");
    press("ArrowRight", tabs(tabList.length - 1));
    expect(tabs(0).getAttribute("aria-selected")).toBe("true");
    act(() => tabs(2).click());
    expect(tabs(2).getAttribute("aria-selected")).toBe("true");
  });

  it("pricing switch flips amounts, basis notes and keeps CTA links real", () => {
    act(() =>
      root.render(
        <BlockPricing
          plans={[
            { name: "Solo", priceMonthly: 0, features: ["one"], cta: { label: "Free", href: "/free" } },
            { name: "Team", priceMonthly: 24, priceAnnual: 20, features: ["two"], cta: { label: "Buy", href: "/buy" } },
          ]}
        />,
      ),
    );
    const amounts = () => [...container.querySelectorAll(".vfx-pricing-amount")].map((el) => el.textContent);
    expect(amounts()).toEqual(["$0", "$20"]);
    expect(container.textContent).toContain("billed annually");
    const buttons = [...container.querySelectorAll<HTMLButtonElement>(".vfx-pricing-toggle button")];
    act(() => buttons[0]!.click());
    expect(amounts()).toEqual(["$0", "$24"]);
    expect(container.textContent).toContain("billed monthly");
    expect(container.querySelector('a[href="/buy"]')).not.toBeNull();
  });

  it("pricing hides the period toggle when no plan has annual pricing", () => {
    act(() =>
      root.render(
        <BlockPricing plans={[{ name: "Once", priceMonthly: 99, basis: "once" }]} />,
      ),
    );
    expect(container.querySelector(".vfx-pricing-toggle")).toBeNull();
    expect(container.textContent).toContain("one-time");
  });

  it("faq expands and collapses answers with disclosure semantics and arrow keys", () => {
    act(() => root.render(<BlockFaq />));
    const questionList = [...container.querySelectorAll<HTMLButtonElement>(".vfx-faq-question")];
    const questions = (index: number) => questionList[index]!;
    expect(questionList.length).toBeGreaterThanOrEqual(4);
    expect(questions(0).getAttribute("aria-expanded")).toBe("true");
    expect(questions(1).getAttribute("aria-expanded")).toBe("false");
    act(() => questions(1).click());
    expect(questions(1).getAttribute("aria-expanded")).toBe("true");
    // Single mode: opening another closed the first.
    expect(questions(0).getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById(questions(1).getAttribute("aria-controls")!)).not.toBeNull();
    press("ArrowDown", questions(1));
    expect(document.activeElement).toBe(questions(2));
    act(() => questions(2).click());
    expect(questions(2).getAttribute("aria-expanded")).toBe("true");
    expect(questions(1).getAttribute("aria-expanded")).toBe("false");
  });

  it("faq allows multiple open answers in multiple mode", () => {
    act(() => root.render(<BlockFaq multiple />));
    const questionList = [...container.querySelectorAll<HTMLButtonElement>(".vfx-faq-question")];
    const questions = (index: number) => questionList[index]!;
    act(() => questions(1).click());
    act(() => questions(2).click());
    expect(questions(0).getAttribute("aria-expanded")).toBe("true");
    expect(questions(1).getAttribute("aria-expanded")).toBe("true");
    expect(questions(2).getAttribute("aria-expanded")).toBe("true");
  });

  it("comparison moves with the range input and labels the value", () => {
    act(() => root.render(<BlockComparison defaultPosition={40} beforeLabel="Old" afterLabel="New" />));
    const range = container.querySelector<HTMLInputElement>(".vfx-comparison-range")!;
    expect(range.value).toBe("40");
    expect(range.getAttribute("aria-valuetext")).toBe("60% new");
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(range, "72");
      range.dispatchEvent(new Event("input", { bubbles: true }));
      range.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(
      container.querySelector<HTMLElement>(".vfx-comparison")!.style.getPropertyValue("--vfx-pos"),
    ).toBe("72%");
  });

  it("comparison accepts real before/after media", () => {
    act(() =>
      root.render(
        <BlockComparison before={<img src="/a.png" alt="a" />} after={<img src="/b.png" alt="b" />} />,
      ),
    );
    expect(container.querySelector('img[src="/a.png"]')).not.toBeNull();
    expect(container.querySelector('img[src="/b.png"]')).not.toBeNull();
  });

  it("scroll story switches the active step via IntersectionObserver", () => {
    const observers: { callback: (entries: { isIntersecting: boolean; target: Element }[]) => void }[] = [];
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: (entries: { isIntersecting: boolean; target: Element }[]) => void) {
        observers.push({ callback });
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    });
    act(() => root.render(<BlockScrollStory />));
    const stepList = [...container.querySelectorAll(".vfx-scroll-story-step")];
    const steps = (index: number) => stepList[index]!;
    expect(steps(0).getAttribute("data-active")).toBe("true");
    expect(observers.length).toBe(1);
    const observer = observers[0]!;
    const thirdStep = steps(2);
    act(() => {
      observer.callback([{ isIntersecting: true, target: thirdStep }]);
    });
    expect(steps(2).getAttribute("data-active")).toBe("true");
    expect(steps(0).getAttribute("data-active")).toBe("false");
  });

  it("integrations renders orbit links and grid tiles from the same data", () => {
    act(() =>
      root.render(
        <BlockIntegrations
          integrations={[
            { name: "GitHub", href: "/i/github", description: "Sync" },
            { name: "Linear", href: "/i/linear" },
          ]}
        />,
      ),
    );
    expect(container.querySelector('a[href="/i/github"]')).not.toBeNull();
    expect(container.querySelector('a[href="/i/linear"]')).not.toBeNull();
    expect(container.querySelector(".vfx-integrations-grid")!.textContent).toContain("GitHub");
  });

  it("testimonials mark fictional demo content and support real quotes", () => {
    act(() => root.render(<BlockTestimonials />));
    expect(container.querySelector(".vfx-testimonials-mark")?.textContent).toContain("fictional demo content");
    act(() => root.render(<BlockTestimonials demoNote={null} testimonials={[{ quote: "Real", name: "A B", href: "/c" }]} />));
    expect(container.querySelector(".vfx-testimonials-mark")).toBeNull();
    expect(container.querySelector('a[href="/c"]')).not.toBeNull();
  });

  it("showcase renders the demo screen and accepts replacement media", () => {
    act(() => root.render(<BlockShowcase />));
    expect(container.querySelector('[role="img"]')?.getAttribute("aria-label")).toContain("demo");
    act(() => root.render(<BlockShowcase media={<img src="/shot.png" alt="App screenshot" />} />));
    expect(container.querySelector('img[src="/shot.png"]')).not.toBeNull();
  });

  it("feature grid links cells and supports the even layout", () => {
    act(() =>
      root.render(
        <BlockFeatureGrid
          layout="even"
          items={[{ title: "One", description: "First", href: "/one" }]}
        />,
      ),
    );
    expect(container.querySelector('.vfx-feature-grid[data-layout="even"]')).not.toBeNull();
    expect(container.querySelector('a[href="/one"]')?.getAttribute("aria-label")).toBe("One");
  });

  it("process steps and CTA keep real destinations and settle without observers", () => {
    act(() =>
      root.render(
        <>
          <BlockProcessSteps action={{ label: "Docs", href: "/docs" }} />
          <BlockCta primaryCta={{ label: "Start", href: "/start" }} />
        </>,
      ),
    );
    expect(container.querySelector('a[href="/docs"]')).not.toBeNull();
    expect(container.querySelector('a[href="/start"]')).not.toBeNull();
  });
});

describe("example pages", () => {
  it("render server-side with nav, sections, pricing and footer", () => {
    const html = renderToString(
      <>
        <ExampleLaunch />
        <ExampleStudio />
      </>,
    );
    expect(html).toContain("vfx-example-launch");
    expect(html).toContain("vfx-example-studio");
    expect(html).toContain("Lumen Labs");
    expect(html).toContain("Atelier North");
    expect(html).toContain("vfx-pricing");
    expect(html).toContain("vfx-faq");
    expect(html).toContain("vfx-comparison");
    expect(html).toContain("fictional");
  });
});
