import { describe, it, expect } from "vitest";
import { safeHalfWidth, safeLineWidth } from "../lib/round-geometry.js";

describe("safeHalfWidth", () => {
  it("is the full radius on the centre line and zero at the edge", () => {
    expect(safeHalfWidth(233, 0)).toBe(233);
    expect(safeHalfWidth(233, 233)).toBe(0);
    expect(safeHalfWidth(233, 400)).toBe(0);
  });

  it("follows the circle (5-12-13 triangle)", () => {
    expect(safeHalfWidth(130, 50)).toBe(120);
  });
});

describe("safeLineWidth", () => {
  it("gives a centred line more room than one near the bezel", () => {
    const middle = safeLineWidth(466, 233, 40, 6);
    const nearTop = safeLineWidth(466, 40, 40, 6);
    expect(middle).toBeGreaterThan(nearTop);
  });

  it("never returns a negative width", () => {
    expect(safeLineWidth(466, 0, 40, 6)).toBe(0);
    expect(safeLineWidth(466, 466, 40, 6)).toBe(0);
  });
});
