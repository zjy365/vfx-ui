import { describe, it, expect } from "vitest";
import { createAstraStars } from "../src/components/AstraField";
describe("Astra procedural field", () => {
  it("keeps seeded stars stable and finite while changing the composition by seed and shape", () => {
    const a = createAstraStars(762419, "six", 1000),
      b = createAstraStars(762419, "six", 1000);
    expect(a).toEqual(b);
    expect(a.every(Number.isFinite)).toBe(true);
    expect(a).not.toEqual(createAstraStars(762420, "six", 1000));
    expect(a).not.toEqual(createAstraStars(762419, "galaxy", 1000));
  });
});
