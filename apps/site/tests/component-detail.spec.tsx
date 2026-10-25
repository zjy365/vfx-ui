import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ComponentDetail } from '../src/components/component-detail';
import { components } from '../src/lib/catalog';

vi.mock('next/link', () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement, root: Root;
beforeEach(() => {
  history.replaceState(null, '', '/heroes/hero-fluid/');
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.restoreAllMocks(); });
const fluid = components.find(item => item.id === 'hero-fluid')!;
function button(label: string) {
  return [...container.querySelectorAll<HTMLButtonElement>('button')].find(element => element.textContent?.trim() === label)!;
}
function sent() {
  const frame = container.querySelector('iframe')!;
  const send = vi.spyOn(frame.contentWindow!, 'postMessage');
  act(() => frame.dispatchEvent(new Event('load')));
  return send.mock.calls.at(-1)![0] as { scheme: string; props: Record<string, unknown> };
}
it('restores the complete trusted preset and editable overrides in fullscreen', () => {
  act(() => root.render(<ComponentDetail item={fluid} />));
  act(() => button('Magma').click());
  const before = sent();
  const link = container.querySelector<HTMLAnchorElement>('[aria-label="Open fullscreen preview"]')!;
  history.replaceState(null, '', link.href);
  act(() => root.render(<ComponentDetail key="fullscreen" item={fluid} fullscreen />));
  expect(sent().props).toEqual(before.props);
});
it('retains a preset after editing its title before opening fullscreen', () => {
  act(() => root.render(<ComponentDetail item={fluid} variantId="magma" />));
  const input = container.querySelector<HTMLTextAreaElement>('textarea')!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!.call(input, 'My headline');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const before = sent();
  const link = container.querySelector<HTMLAnchorElement>('[aria-label="Open fullscreen preview"]')!;
  history.replaceState(null, '', link.href);
  act(() => root.render(<ComponentDetail key="fullscreen" item={fluid} fullscreen />));
  expect(sent().props).toEqual(before.props);
});
it('does not accept arbitrary shared props or unknown presets', () => {
  history.replaceState(null, '', '/preview/hero-fluid/?preset=unknown&props=' + encodeURIComponent(JSON.stringify({ title: 'Shared title', style: { position: 'fixed' }, warp: 999 })));
  act(() => root.render(<ComponentDetail item={fluid} fullscreen />));
  expect(sent().props.title).toBe('Shared title');
  expect(sent().props).not.toHaveProperty('style');
  expect(sent().props).not.toHaveProperty('warp');
});
it('keeps block controls, toolbar, usage code and preview theme in sync', () => {
  act(() => root.render(<ComponentDetail item={components.find(item => item.id === 'block-nav')!} />));
  const control = container.querySelector<HTMLSelectElement>('select')!;
  expect(control.value).toBe('dark');
  expect(sent().scheme).toBe('dark');
  act(() => { control.value = 'light'; control.dispatchEvent(new Event('change', { bubbles: true })); });
  expect(sent().scheme).toBe('light');
  expect(sent().props.scheme).toBe('light');
  act(() => container.querySelector<HTMLButtonElement>('[title="Change preview theme"]')!.click());
  expect(control.value).toBe('dark');
  expect(sent().scheme).toBe('dark');
  expect(sent().props.scheme).toBe('dark');
  expect(container.querySelector('.dw-code')?.textContent).toContain('scheme: "dark"');
});
