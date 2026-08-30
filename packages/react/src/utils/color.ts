/** Convert a hex color (#rgb, #rgba, #rrggbb, #rrggbbaa) to [r, g, b] in 0..1. */
export function hexToRgb01(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length !== 6) return [0, 0, 0];
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 0xff) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}
