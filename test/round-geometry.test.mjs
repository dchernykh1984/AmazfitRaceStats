import { describe, it, expect } from "vitest";
import { safeHalfWidth, safeLineWidth, lineWidth } from "../lib/round-geometry.js";

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

describe("lineWidth", () => {
  it("chord-limits a round screen, matching safeLineWidth", () => {
    expect(lineWidth(true, 466, 40, 40, 6)).toBe(safeLineWidth(466, 40, 40, 6));
    expect(lineWidth(true, 466, 233, 40, 6)).toBe(safeLineWidth(466, 233, 40, 6));
  });

  it("uses the full width minus padding on a square screen, independent of y", () => {
    expect(lineWidth(false, 390, 40, 40, 6)).toBe(390 - 12);
    expect(lineWidth(false, 390, 0, 40, 6)).toBe(lineWidth(false, 390, 225, 40, 6));
  });

  it("gives a square line more room than a round one near the bezel", () => {
    expect(lineWidth(false, 466, 20, 40, 6)).toBeGreaterThan(lineWidth(true, 466, 20, 40, 6));
  });

  it("never returns a negative width", () => {
    expect(lineWidth(false, 8, 40, 40, 6)).toBe(0);
  });
});
