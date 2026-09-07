// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FooterTidal } from "../src/components/FooterTidal";
import { FooterFold } from "../src/components/FooterFold";
import { FooterPhosphor } from "../src/components/FooterPhosphor";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root, host: HTMLDivElement;
let frames: Map<number, FrameRequestCallback>, next: number;
let reduced = false;
let preference: () => void;
let visibility: (entries: { isIntersecting: boolean }[]) => void;
const disconnect = vi.fn();
const context = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  setTransform: vi.fn(),
  fillText: vi.fn(),
  measureText: () => ({ width: 400 }),
  getImageData: () => ({
    data: new Uint8ClampedArray(640 * 280 * 4).fill(255),
  }),
};
function advance(times = 1) {
  for (let i = 0; i < times; i++) {
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach((fn) => fn((i + 1) * 16)));
  }
}
function move(el: Element, pointerType = "mouse") {
  const event = new MouseEvent("pointermove", {
    bubbles: true,
    clientX: 500,
    clientY: 180,
  });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  act(() => el.dispatchEvent(event));
}
beforeEach(() => {
  vi.clearAllMocks();
  frames = new Map();
  next = 0;
  reduced = false;
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, fn: () => void) => {
      preference = fn;
    },
    removeEventListener() {},
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(fn: typeof visibility) {
        visibility = fn;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as never,
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 640,
    height: 280,
    right: 640,
    bottom: 280,
    toJSON() {},
  });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("complete footer contracts", () => {
  it.each([FooterTidal, FooterFold, FooterPhosphor])(
    "renders real consumer content and destinations on the server",
    (Component) => {
      const html = renderToString(
        <Component
          brand="ACME"
          title="Your next chapter"
          cta={{ label: "Contact", href: "mailto:hello@acme.test" }}
          groups={[
            { label: "Product", links: [{ label: "Docs", href: "/docs" }] },
          ]}
          copyright="© ACME"
          legal={[{ label: "Privacy", href: "/privacy" }]}
        />,
      );
      expect(html).toContain("<footer");
      expect(html).toContain('aria-label="ACME footer"');
      expect(html).toContain('href="/docs"');
      expect(html).toContain('href="mailto:hello@acme.test"');
      expect(html).toContain('href="/privacy"');
      expect(html).not.toContain('href="#"');
      expect(html).toContain("Your next chapter");
    },
  );
  it("lets custom children replace copy/navigation while retaining the artwork and legal row", () => {
    act(() =>
      root.render(
        <FooterFold brand="ACME" title="Discard" copyright="© ACME">
          <a href="/custom">Custom layout</a>
        </FooterFold>,
      ),
    );
    expect(host.textContent).not.toContain("Discard");
    expect(host.querySelector('a[href="/custom"]')).not.toBeNull();
    expect(host.querySelector(".vfx-fold-art")).not.toBeNull();
    expect(host.querySelector(".vfx-footer-legal")?.textContent).toContain(
      "© ACME",
    );
  });
  it("fold motion settles, resets on leave, and changes depth without pointer movement", () => {
    act(() => root.render(<FooterFold depth={20} />));
    const footer = host.querySelector("footer")!;
    const panel = host.querySelector(".vfx-fold-panel") as HTMLElement;
    const resting = panel.style.getPropertyValue("--fold-turn");
    move(footer);
    advance(140);
    expect(frames.size).toBe(0);
    expect(panel.style.getPropertyValue("--fold-turn")).not.toBe(resting);
    act(() => footer.dispatchEvent(new Event("pointerleave")));
    advance(140);
    expect(panel.style.getPropertyValue("--fold-turn")).toBe(resting);
    act(() => root.render(<FooterFold depth={45} />));
    expect(footer.style.getPropertyValue("--vf-depth")).toBe("45");
  });
  it("stops the flowing tide offscreen and resumes when visible", () => {
    act(() => root.render(<FooterTidal />));
    advance();
    expect(frames.size).toBe(1);
    visibility([{ isIntersecting: false }]);
    expect(frames.size).toBe(0);
    visibility([{ isIntersecting: true }]);
    expect(frames.size).toBe(1);
    act(() => root.render(null));
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalledTimes(2);
  });
  it("responds immediately to system reduced-motion changes", () => {
    act(() => root.render(<FooterTidal />));
    advance();
    reduced = true;
    act(() => preference());
    expect(frames.size).toBe(0);
    move(host.querySelector("footer")!);
    expect(frames.size).toBe(0);
    reduced = false;
    act(() => preference());
    expect(frames.size).toBe(1);
  });
  it("preserves a still composition for touch and interactive=false", () => {
    act(() => root.render(<FooterTidal animate={false} />));
    advance();
    move(host.querySelector("footer")!, "touch");
    expect(frames.size).toBe(0);
    act(() => root.render(<FooterTidal animate={false} interactive={false} />));
    advance();
    move(host.querySelector("footer")!);
    expect(frames.size).toBe(0);
  });
  it("updates the point cloud when the brand changes, then sleeps after dispersal", () => {
    act(() => root.render(<FooterPhosphor brand="FIRST" />));
    advance();
    expect(frames.size).toBe(0);
    expect(context.fillText).toHaveBeenLastCalledWith(
      "FIRST",
      expect.any(Number),
      142.8,
    );
    act(() => root.render(<FooterPhosphor brand="NEXT" />));
    advance();
    expect(context.fillText).toHaveBeenLastCalledWith(
      "NEXT",
      expect.any(Number),
      142.8,
    );
    move(host.querySelector("footer")!);
    advance(140);
    expect(frames.size).toBe(0);
    expect(context.fillRect).toHaveBeenCalled();
  });
  it("keeps the DOM footer usable when no canvas context is available", () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);
    act(() =>
      root.render(
        <FooterPhosphor
          brand="STILL"
          cta={{ label: "Contact", href: "/contact" }}
        />,
      ),
    );
    expect(host.querySelector("a")?.getAttribute("href")).toBe("/contact");
    expect(host.querySelector(".vfx-phosphor-fallback")?.textContent).toBe(
      "STILL",
    );
    expect(frames.size).toBe(0);
  });
});
